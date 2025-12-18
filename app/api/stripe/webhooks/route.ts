import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook processing (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    console.error('[WEBHOOK] Missing signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log(`[WEBHOOK] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK] Error processing event:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] Processing checkout.session.completed');

  // Check if this is a shop order or subscription
  const orderType = session.metadata?.order_type;

  if (orderType === 'shop') {
    await handleShopOrderCompleted(session);
    return;
  }

  // Handle subscription checkout
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const customerEmail = session.customer_email || session.customer_details?.email;
  const plan = session.metadata?.plan as 'monthly' | 'annual' | undefined;
  const userId = session.metadata?.user_id;

  // Update user profile with subscription info
  if (userId) {
    // User was logged in during checkout
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_plan: plan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('[WEBHOOK] Error updating profile:', error);
      throw error;
    }
    console.log(`[WEBHOOK] Updated profile for user: ${userId}`);
  } else if (customerEmail) {
    // Guest checkout - update by email if profile exists
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_plan: plan,
        updated_at: new Date().toISOString(),
      })
      .eq('email', customerEmail);

    if (error) {
      console.error('[WEBHOOK] Error updating profile by email:', error);
    }
    console.log(`[WEBHOOK] Attempted to update profile for email: ${customerEmail}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('[WEBHOOK] Processing customer.subscription.updated');

  const status = subscription.status === 'active' ? 'active' :
                 subscription.status === 'past_due' ? 'past_due' :
                 subscription.status === 'canceled' ? 'canceled' : 'inactive';

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('[WEBHOOK] Error updating subscription status:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[WEBHOOK] Processing customer.subscription.deleted');

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      stripe_subscription_id: null,
      subscription_plan: null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('[WEBHOOK] Error handling subscription deletion:', error);
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[WEBHOOK] Processing invoice.payment_failed');

  // Get subscription ID from parent - invoice may have subscription_details or we get it from lines
  const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined;

  if (!subscriptionId) {
    console.log('[WEBHOOK] No subscription ID found in invoice');
    return;
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('[WEBHOOK] Error updating payment status:', error);
  }
}

async function handleShopOrderCompleted(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] Processing shop order checkout.session.completed');

  const userId = session.metadata?.user_id;
  const itemsJson = session.metadata?.items;
  const shippingAddressJson = session.metadata?.shipping_address;

  if (!userId || !itemsJson || !shippingAddressJson) {
    console.error('[WEBHOOK] Missing required metadata for shop order');
    return;
  }

  const items = JSON.parse(itemsJson);
  const shippingAddress = JSON.parse(shippingAddressJson);

  // Create order in database
  const { data: order, error: orderError } = await supabaseAdmin
    .from('shop_orders')
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'paid',
      total_cents: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || 'USD',
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('[WEBHOOK] Error creating shop order:', orderError);
    throw orderError;
  }

  console.log(`[WEBHOOK] Created order ${order.id}`);

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity,
    price_cents: item.priceCents,
    spreadconnect_sku: item.variantSku,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('shop_order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('[WEBHOOK] Error creating order items:', itemsError);
    throw itemsError;
  }

  console.log(`[WEBHOOK] Created ${orderItems.length} order items`);

  // Submit order to SpreadConnect
  try {
    const { submitOrderToSpreadConnect, formatAddressForSpreadConnect } = await import('@/lib/spreadconnect');

    const spreadConnectOrder = {
      reference: order.id,
      recipient: formatAddressForSpreadConnect(shippingAddress),
      items: items.map((item: any) => ({
        sku: item.variantSku,
        quantity: item.quantity,
      })),
    };

    const { spreadconnectOrderId } = await submitOrderToSpreadConnect(spreadConnectOrder);

    // Update order with SpreadConnect order ID
    const { error: updateError } = await supabaseAdmin
      .from('shop_orders')
      .update({
        spreadconnect_order_id: spreadconnectOrderId,
        status: 'submitted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('[WEBHOOK] Error updating order with SpreadConnect ID:', updateError);
    } else {
      console.log(`[WEBHOOK] Order submitted to SpreadConnect: ${spreadconnectOrderId}`);
    }
  } catch (spreadConnectError) {
    console.error('[WEBHOOK] Error submitting to SpreadConnect:', spreadConnectError);
    // Don't throw - order is created, we can retry SpreadConnect submission later
  }
}

