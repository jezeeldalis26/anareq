import { adminDb, readRawBody } from './_firebaseAdmin.js';
import { stripe } from './_stripe.js';

const getPlanFromSubscription = (subscription) => {
  const priceId = subscription?.items?.data?.[0]?.price?.id || '';
  if (priceId === (process.env.STRIPE_PRICE_YEARLY || process.env.VITE_STRIPE_PRICE_YEARLY || 'price_1TlAm60n3w9ZwMLHObEcHka1')) return 'yearly';
  if (priceId === (process.env.STRIPE_PRICE_MONTHLY || process.env.VITE_STRIPE_PRICE_MONTHLY || 'price_1TlAjy0n3w9ZwMLHKSzYoEF9')) return 'monthly';
  return subscription?.metadata?.plan || '';
};

const findUserRefForSubscription = async (subscription) => {
  const uid = subscription?.metadata?.uid;
  if (uid) return adminDb.collection('users').doc(uid);

  const customerId = String(subscription?.customer || '');
  if (!customerId) return null;
  const query = await adminDb.collection('users').where('billing.stripeCustomerId', '==', customerId).limit(1).get();
  if (!query.empty) return query.docs[0].ref;
  return null;
};

const syncSubscription = async (subscription) => {
  const userRef = await findUserRefForSubscription(subscription);
  if (!userRef) return;

  const activeStatuses = new Set(['active', 'trialing']);
  const isActive = activeStatuses.has(subscription.status);
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;
  const planType = getPlanFromSubscription(subscription);
  const nowIso = new Date().toISOString();

  await userRef.set({
    subscriptionStatus: isActive ? 'active' : 'expired',
    accessSource: 'stripe',
    planType,
    currentPeriodEnd: periodEnd,
    stripeCustomerId: String(subscription.customer || ''),
    stripeSubscriptionId: subscription.id,
    billing: {
      stripeCustomerId: String(subscription.customer || ''),
      stripeSubscriptionId: subscription.id,
      stripeStatus: subscription.status,
      planType,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      lastStripeEventAt: nowIso
    },
    updatedAt: nowIso
  }, { merge: true });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = endpointSecret
      ? stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)
      : JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    console.error('stripe-webhook signature error:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await syncSubscription(subscription);
      }
    }

    if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
      await syncSubscription(event.data.object);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('stripe-webhook sync error:', error);
    return res.status(500).json({ error: 'webhook_sync_failed' });
  }
}
