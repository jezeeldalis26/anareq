import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil'
});

export const APP_URL = process.env.VITE_APP_URL || process.env.APP_URL || 'https://anareq.com';
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || process.env.VITE_STRIPE_PRICE_MONTHLY || 'price_1TlAjy0n3w9ZwMLHKSzYoEF9',
  yearly: process.env.STRIPE_PRICE_YEARLY || process.env.VITE_STRIPE_PRICE_YEARLY || 'price_1TlAm60n3w9ZwMLHObEcHka1'
};
