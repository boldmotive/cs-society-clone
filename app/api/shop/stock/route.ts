import { NextResponse, type NextRequest } from 'next/server';
import { getSpreadConnectClient } from '@/lib/spreadconnect';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// POST check stock for multiple SKUs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skus } = body as { skus: string[] };

    if (!Array.isArray(skus) || skus.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Provide an array of SKUs.' },
        { status: 400 }
      );
    }

    // Initialize SpreadConnect client
    let spreadConnect;
    try {
      spreadConnect = getSpreadConnectClient();
    } catch (error) {
      console.error('[Shop Stock] SpreadConnect client error:', error);
      return NextResponse.json(
        { error: 'SpreadConnect API not configured' },
        { status: 500 }
      );
    }

    // Fetch stock for each SKU
    const stockResults: Record<string, number> = {};

    for (const sku of skus) {
      try {
        const stock = await spreadConnect.getStockBySku(sku);
        stockResults[sku] = stock;
      } catch (error) {
        console.error(`[Shop Stock] Error fetching stock for ${sku}:`, error);
        stockResults[sku] = 0; // Default to 0 if error
      }
    }

    // Update local database cache
    const supabase = await createSupabaseServerClient();
    
    for (const [sku, quantity] of Object.entries(stockResults)) {
      await supabase
        .from('shop_product_variants')
        .update({
          stock_quantity: quantity,
          is_available: quantity > 0,
        })
        .eq('spreadconnect_sku', sku);
    }

    return NextResponse.json({
      stock: stockResults,
      cached_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Shop Stock] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check stock' },
      { status: 500 }
    );
  }
}
