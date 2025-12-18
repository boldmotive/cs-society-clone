import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook processing (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

/**
 * SpreadConnect Webhook Handler
 * 
 * Note: SpreadConnect does not provide webhook signature verification.
 * We rely on the webhook URL being non-guessable and server-side validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    console.log('[SpreadConnect Webhook] Received event:', event);

    switch (event) {
      case 'order.processed':
        await handleOrderProcessed(data);
        break;

      case 'shipment.sent':
        await handleShipmentSent(data);
        break;

      case 'order.cancelled':
        await handleOrderCancelled(data);
        break;

      case 'order.needs-action':
        await handleOrderNeedsAction(data);
        break;

      default:
        console.log('[SpreadConnect Webhook] Unhandled event type:', event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[SpreadConnect Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleOrderProcessed(data: any) {
  console.log('[SpreadConnect Webhook] Processing order.processed');

  const { orderId, reference } = data;

  if (!reference) {
    console.error('[SpreadConnect Webhook] No reference (order ID) in webhook data');
    return;
  }

  // Update order status
  const { error } = await supabaseAdmin
    .from('shop_orders')
    .update({
      status: 'processing',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reference);

  if (error) {
    console.error('[SpreadConnect Webhook] Error updating order status:', error);
    throw error;
  }

  console.log(`[SpreadConnect Webhook] Order ${reference} marked as processing`);
}

async function handleShipmentSent(data: any) {
  console.log('[SpreadConnect Webhook] Processing shipment.sent');

  const { orderId, reference, trackingNumber, trackingUrl, carrier } = data;

  if (!reference) {
    console.error('[SpreadConnect Webhook] No reference (order ID) in webhook data');
    return;
  }

  // Update order with tracking info
  const { error } = await supabaseAdmin
    .from('shop_orders')
    .update({
      status: 'shipped',
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reference);

  if (error) {
    console.error('[SpreadConnect Webhook] Error updating order with tracking:', error);
    throw error;
  }

  console.log(`[SpreadConnect Webhook] Order ${reference} marked as shipped with tracking`);
}

async function handleOrderCancelled(data: any) {
  console.log('[SpreadConnect Webhook] Processing order.cancelled');

  const { orderId, reference, reason } = data;

  if (!reference) {
    console.error('[SpreadConnect Webhook] No reference (order ID) in webhook data');
    return;
  }

  // Update order status
  const { error } = await supabaseAdmin
    .from('shop_orders')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reference);

  if (error) {
    console.error('[SpreadConnect Webhook] Error updating order status:', error);
    throw error;
  }

  console.log(`[SpreadConnect Webhook] Order ${reference} marked as cancelled`);
}

async function handleOrderNeedsAction(data: any) {
  console.log('[SpreadConnect Webhook] Processing order.needs-action');

  const { orderId, reference, message } = data;

  if (!reference) {
    console.error('[SpreadConnect Webhook] No reference (order ID) in webhook data');
    return;
  }

  // Log the issue but don't change status
  console.warn(`[SpreadConnect Webhook] Order ${reference} needs action: ${message}`);
  
  // In production, you might want to:
  // - Send email to admin
  // - Create a notification in the system
  // - Add a flag to the order
}
