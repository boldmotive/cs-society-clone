import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { items, shippingAddress } = body as {
      items: Array<{
        variantId: string;
        variantSku: string;
        quantity: number;
        priceCents: number;
        productName: string;
        size: string;
        color: string;
      }>;
      shippingAddress: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        street: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
      };
    };

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate shipping address
    if (!shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      );
    }

    // Verify products and prices from database
    const variantIds = items.map(item => item.variantId);
    const { data: variants, error: variantsError } = await supabase
      .from('shop_product_variants')
      .select(`
        id,
        spreadconnect_sku,
        base_price_cents,
        is_available,
        product:shop_products(id, name, image_url)
      `)
      .in('id', variantIds);

    if (variantsError || !variants) {
      console.error('[Shop Checkout] Error fetching variants:', variantsError);
      return NextResponse.json(
        { error: 'Failed to verify products' },
        { status: 500 }
      );
    }

    // Get markup percentage
    const { data: settings } = await supabase
      .from('shop_settings')
      .select('markup_percentage')
      .single();

    const markupPercentage = settings?.markup_percentage || 0.30;

    // Verify each item and calculate total
    let totalCents = 0;
    const verifiedItems: Array<{
      variantId: string;
      productId: string;
      productName: string;
      variantSku: string;
      quantity: number;
      priceCents: number;
      imageUrl?: string;
    }> = [];

    for (const item of items) {
      const variant = variants.find(v => v.id === item.variantId);
      
      if (!variant) {
        return NextResponse.json(
          { error: `Product variant not found: ${item.variantId}` },
          { status: 400 }
        );
      }

      if (!variant.is_available) {
        return NextResponse.json(
          { error: `Product is out of stock: ${(variant.product as any).name}` },
          { status: 400 }
        );
      }

      // Calculate and verify price
      const expectedPrice = Math.round(variant.base_price_cents * (1 + markupPercentage));
      
      verifiedItems.push({
        variantId: variant.id,
        productId: (variant.product as any).id,
        productName: (variant.product as any).name,
        variantSku: variant.spreadconnect_sku,
        quantity: item.quantity,
        priceCents: expectedPrice,
        imageUrl: (variant.product as any).image_url,
      });

      totalCents += expectedPrice * item.quantity;
    }

    // Get user's Stripe customer ID if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    // Build Stripe line items
    const lineItems = verifiedItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.productName}`,
          description: `Size: ${items.find(i => i.variantId === item.variantId)?.size}, Color: ${items.find(i => i.variantId === item.variantId)?.color}`,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    const sessionParams: any = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${origin}/shop/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/checkout?canceled=true`,
      metadata: {
        user_id: user.id,
        order_type: 'shop',
        items: JSON.stringify(verifiedItems.map(item => ({
          variantId: item.variantId,
          productId: item.productId,
          variantSku: item.variantSku,
          quantity: item.quantity,
          priceCents: item.priceCents,
        }))),
        shipping_address: JSON.stringify(shippingAddress),
      },
    };

    // Attach customer if exists
    if (profile?.stripe_customer_id) {
      sessionParams.customer = profile.stripe_customer_id;
    } else {
      sessionParams.customer_email = user.email || profile?.email || shippingAddress.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[Shop Checkout] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
