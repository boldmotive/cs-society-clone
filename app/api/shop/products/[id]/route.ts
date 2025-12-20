import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET single product with variants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;

    // Fetch product with variants and images
    const { data: product, error } = await supabase
      .from('shop_products')
      .select(`
        *,
        variants:shop_product_variants(*),
        images:shop_product_images(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('[Shop Product] Query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    // Get markup percentage from settings
    const { data: settings } = await supabase
      .from('shop_settings')
      .select('markup_percentage')
      .single();

    const markupPercentage = settings?.markup_percentage || 0.30;

    // Calculate final prices for each variant and sort images
    const productWithPricing = {
      ...product,
      variants: product.variants?.map((variant: any) => ({
        ...variant,
        base_price_cents: variant.base_price_cents,
        final_price_cents: Math.round(variant.base_price_cents * (1 + markupPercentage)),
        markup_percentage: markupPercentage,
      })) || [],
      // Sort images by sort_order
      images: (product.images || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)),
    };

    return NextResponse.json(productWithPricing);
  } catch (error) {
    console.error('[Shop Product] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
