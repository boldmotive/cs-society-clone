import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET single product with variants
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = params;

    // Fetch product with variants
    const { data: product, error } = await supabase
      .from('shop_products')
      .select(`
        *,
        variants:shop_product_variants(*)
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

    // Calculate final prices for each variant
    const productWithPricing = {
      ...product,
      variants: product.variants?.map((variant: any) => ({
        ...variant,
        base_price_cents: variant.base_price_cents,
        final_price_cents: Math.round(variant.base_price_cents * (1 + markupPercentage)),
        markup_percentage: markupPercentage,
      })) || [],
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
