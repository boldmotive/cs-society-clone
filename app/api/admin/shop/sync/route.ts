import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getSpreadConnectClient } from '@/lib/spreadconnect';

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
        debugLog.push(`Processing article: ${article.id} - "${article.name}"`);
        debugLog.push(`Article has ${article.variants?.length || 0} variants`);
        console.log(`[Shop Sync] Processing article: ${article.id} - "${article.name}"`);
        console.log(`[Shop Sync] Article has ${article.variants?.length || 0} variants`);
        
        // Upsert product
        const { data: existingProduct } = await supabase
          .from('shop_products')
          .select('id')
          .eq('spreadconnect_id', article.id)
          .single();

        const productData = {
          spreadconnect_id: article.id,
          name: article.name,
          description: article.description || null,
          image_url: article.images?.[0] || null,
          is_active: true,
        };

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
              const stockQuantity = stockData.items[variant.sku] || 0;

              const variantData = {
                product_id: productId,
                spreadconnect_sku: variant.sku,
                size: variant.sizeId,
                color: variant.appearanceId,
                appearance_id: variant.appearanceId,
                base_price_cents: Math.round(variant.price * 100), // Convert to cents
                stock_quantity: stockQuantity,
                is_available: stockQuantity > 0,
              };

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
