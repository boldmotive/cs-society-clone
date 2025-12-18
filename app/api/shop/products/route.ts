import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET all products with pricing
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('shop_products')
      .select(`
        *,
        variants:shop_product_variants(*)
      `, { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error, count } = await query;

    if (error) {
      console.error('[Shop Products] Query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
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
    const productsWithPricing = products?.map(product => ({
      ...product,
      variants: product.variants?.map((variant: any) => ({
        ...variant,
        base_price_cents: variant.base_price_cents,
        final_price_cents: Math.round(variant.base_price_cents * (1 + markupPercentage)),
        markup_percentage: markupPercentage,
      })) || [],
    }));

    return NextResponse.json({
      products: productsWithPricing,
      count: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Shop Products] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
