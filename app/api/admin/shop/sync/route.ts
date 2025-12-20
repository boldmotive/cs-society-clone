import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getSpreadConnectClient, getArticleImageUrl, getArticleImages } from '@/lib/spreadconnect';

// POST sync products from SpreadConnect
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Initialize SpreadConnect client
    let spreadConnect;
    try {
      spreadConnect = getSpreadConnectClient();
    } catch (error) {
      console.error('[Shop Sync] SpreadConnect client error:', error);
      return NextResponse.json(
        { error: 'SpreadConnect API credentials not configured' },
        { status: 500 }
      );
    }

    // Fetch all articles from SpreadConnect
    console.log('[Shop Sync] Fetching articles from SpreadConnect...');
    const articlesResponse = await spreadConnect.getArticles({ limit: 100 });
    const articles = articlesResponse.items;

    console.log(`[Shop Sync] Found ${articles.length} articles`);

    let productsAdded = 0;
    let productsUpdated = 0;
    let variantsAdded = 0;
    const debugLog: string[] = [];

    // Fetch stock data for all variants
    console.log('[Shop Sync] Fetching stock data...');
    const stockData = await spreadConnect.getStock({ limit: 1000 });

    // Process each article
    for (const article of articles) {
      try {
        debugLog.push(`Processing article: ${article.id}`);
        debugLog.push(`Raw article data: ${JSON.stringify(article).substring(0, 500)}`);
        debugLog.push(`Article has ${article.variants?.length || 0} variants`);
        console.log(`[Shop Sync] Processing article:`, article);
        console.log(`[Shop Sync] Article has ${article.variants?.length || 0} variants`);
        
        // Extract name - SpreadConnect might use different field names
        // Cast to any to access potential fields not in our type definition
        const articleAny = article as any;
        const productName = article.name || articleAny.title || articleAny.productName || `Product ${article.id}`;
        
        // Upsert product
        const { data: existingProduct } = await supabase
          .from('shop_products')
          .select('id')
          .eq('spreadconnect_id', article.id)
          .single();

        // Extract image URL from images array (API returns objects with imageUrl property)
        const imageUrl = getArticleImageUrl(article);

        const productData = {
          spreadconnect_id: article.id,
          name: productName,
          description: article.description || null,
          image_url: imageUrl,
          is_active: true,
        };

        debugLog.push(`Image URL extracted: "${imageUrl}"`);
        console.log(`[Shop Sync] Image URL:`, imageUrl);

        debugLog.push(`Product name: "${productName}"`);
        console.log(`[Shop Sync] Product data:`, productData);

        let productId: string;

        if (existingProduct) {
          // Update existing product
          const { data: updatedProduct, error: updateError } = await supabase
            .from('shop_products')
            .update(productData)
            .eq('id', existingProduct.id)
            .select('id')
            .single();

          if (updateError) {
            debugLog.push(`ERROR updating product: ${JSON.stringify(updateError)}`);
            console.error(`[Shop Sync] Error updating product ${article.id}:`, updateError);
            continue;
          }

          productId = updatedProduct.id;
          productsUpdated++;
          debugLog.push(`✓ Updated product ${productId}`);
          console.log(`[Shop Sync] Updated product ${productId}`);
        } else {
          // Insert new product
          const { data: newProduct, error: insertError } = await supabase
            .from('shop_products')
            .insert(productData)
            .select('id')
            .single();

          if (insertError) {
            debugLog.push(`ERROR inserting product: ${JSON.stringify(insertError)}`);
            console.error(`[Shop Sync] Error inserting product ${article.id}:`, insertError);
            continue;
          }

          productId = newProduct.id;
          productsAdded++;
          debugLog.push(`✓ Inserted new product ${productId}`);
          console.log(`[Shop Sync] Inserted new product ${productId}`);
        }

        // Process variants
        if (article.variants && article.variants.length > 0) {
          debugLog.push(`Processing ${article.variants.length} variants`);
          console.log(`[Shop Sync] Processing ${article.variants.length} variants for product ${productId}`);
          for (const variant of article.variants) {
            try {
              // Log first variant to see structure
              if (article.variants.indexOf(variant) === 0) {
                debugLog.push(`Sample variant data: ${JSON.stringify(variant).substring(0, 500)}`);
              }

              const stockQuantity = stockData.items[variant.sku] || 0;

              // Extract price from SpreadConnect API
              // API returns prices in dollars (e.g., 21.56), we store in cents
              // d2cPrice = Direct to Consumer price, b2bPrice = B2B price
              const variantAny = variant as any;
              const priceInDollars = variant.d2cPrice || variant.b2bPrice || variantAny.d2cPrice || variantAny.b2bPrice || variant.price || 0;
              const priceCents = priceInDollars ? Math.round(priceInDollars * 100) : 0;

              // Use human-readable names for size and color (fallback to IDs if names not available)
              const sizeName = variant.sizeName || variantAny.sizeName || String(variant.sizeId);
              const colorName = variant.appearanceName || variantAny.appearanceName || String(variant.appearanceId);
              const colorHex = variant.appearanceColorValue || variantAny.appearanceColorValue || null;

              const variantData = {
                product_id: productId,
                spreadconnect_sku: variant.sku,
                size: sizeName,
                color: colorName,
                color_hex: colorHex,
                appearance_id: String(variant.appearanceId),
                base_price_cents: priceCents,
                stock_quantity: stockQuantity,
                is_available: stockQuantity > 0,
              };

              if (priceCents === 0) {
                debugLog.push(`⚠️ Warning: Variant ${variant.sku} has no price (d2cPrice: ${variant.d2cPrice}, b2bPrice: ${variant.b2bPrice}), defaulting to $0`);
              }

              debugLog.push(`Variant ${variant.sku}: size="${sizeName}" color="${colorName}" colorHex="${colorHex}" price=$${(priceCents / 100).toFixed(2)}`);
              console.log(`[Shop Sync] Variant data:`, variantData);

              // Upsert variant
              const { error: variantError } = await supabase
                .from('shop_product_variants')
                .upsert(variantData, {
                  onConflict: 'spreadconnect_sku',
                });

              if (variantError) {
                debugLog.push(`ERROR with variant ${variant.sku}: ${JSON.stringify(variantError)}`);
                console.error(`[Shop Sync] Error upserting variant ${variant.sku}:`, variantError);
              } else {
                variantsAdded++;
                debugLog.push(`✓ Added variant ${variant.sku}`);
                console.log(`[Shop Sync] Added variant ${variant.sku}`);
              }
            } catch (variantError) {
              debugLog.push(`EXCEPTION processing variant: ${variantError}`);
              console.error(`[Shop Sync] Error processing variant:`, variantError);
            }
          }
        } else {
          debugLog.push(`⚠️ WARNING: Article has no variants!`);
          console.warn(`[Shop Sync] Article ${article.id} has no variants!`);
        }

        // Process multiple product images
        const articleImages = getArticleImages(article);
        if (articleImages.length > 0) {
          debugLog.push(`Processing ${articleImages.length} images for product ${productId}`);

          // Delete existing images for this product to avoid duplicates
          await supabase
            .from('shop_product_images')
            .delete()
            .eq('product_id', productId);

          // Insert all images
          const imageInserts = articleImages.map((img, index) => ({
            product_id: productId,
            spreadconnect_image_id: String(img.id),
            image_url: img.imageUrl,
            perspective: img.perspective || 'front',
            appearance_id: img.appearanceId ? String(img.appearanceId) : null,
            appearance_name: img.appearanceName || null,
            sort_order: index,
          }));

          const { error: imagesError } = await supabase
            .from('shop_product_images')
            .insert(imageInserts);

          if (imagesError) {
            debugLog.push(`ERROR inserting images: ${JSON.stringify(imagesError)}`);
            console.error(`[Shop Sync] Error inserting images:`, imagesError);
          } else {
            debugLog.push(`✓ Added ${articleImages.length} images`);
          }
        }
      } catch (articleError) {
        debugLog.push(`EXCEPTION processing article: ${articleError}`);
        console.error(`[Shop Sync] Error processing article ${article.id}:`, articleError);
      }
    }

    const summary = {
      success: true,
      productsAdded,
      productsUpdated,
      variantsAdded,
      totalArticles: articles.length,
      debugLog, // Include debug log in response
    };

    console.log('[Shop Sync] Complete:', summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[Shop Sync] Error:', error);
    return NextResponse.json(
      {
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
