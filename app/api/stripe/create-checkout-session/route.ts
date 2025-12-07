import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { stripe, getPriceId, type PlanType } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, successUrl, cancelUrl } = body as {
      plan: PlanType;
      successUrl?: string;
      cancelUrl?: string;
    };

    // Validate plan
    if (!plan || !['monthly', 'annual'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "monthly" or "annual".' },
        { status: 400 }
      );
    }

    // Get price ID for the selected plan
    let priceId: string;
    try {
      priceId = getPriceId(plan);
    } catch {
      return NextResponse.json(
        { error: 'Stripe price not configured for this plan.' },
        { status: 500 }
      );
    }

    // Check if user is logged in (optional - supports guest checkout)
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Build checkout session parameters
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/?canceled=true`,
      metadata: {
        plan,
      },
    };

    // If user is logged in, attach their info to the session
    if (user) {
      // Check if user already has a Stripe customer ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id, email')
        .eq('id', user.id)
        .single();

      if (profile?.stripe_customer_id) {
        sessionParams.customer = profile.stripe_customer_id;
      } else {
        // Pre-fill email for new customers
        sessionParams.customer_email = user.email || profile?.email || undefined;
      }

      // Store user ID in metadata for webhook processing
      sessionParams.metadata = {
        ...sessionParams.metadata,
        user_id: user.id,
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[STRIPE] Checkout session error:', error);

    // Return more detailed error info in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

