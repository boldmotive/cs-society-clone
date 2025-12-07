import Stripe from 'stripe';

// Server-side Stripe client
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV !== 'development') {
  console.warn('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Price IDs from your Stripe Dashboard
// Replace these with your actual price IDs from Stripe
export const STRIPE_PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || '',
  annual: process.env.STRIPE_PRICE_ANNUAL || '',
} as const;

export type PlanType = keyof typeof STRIPE_PRICE_IDS;

// Helper to get price ID by plan type
export function getPriceId(plan: PlanType): string {
  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    throw new Error(`No price ID configured for plan: ${plan}`);
  }
  return priceId;
}

