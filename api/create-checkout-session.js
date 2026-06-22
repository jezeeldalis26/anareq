import { adminDb, requireUser, readJsonBody } from './_firebaseAdmin.js';
import { APP_URL, STRIPE_PRICES, stripe } from './_stripe.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const user = await requireUser(req);
    const body = await readJsonBody(req);
    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';
    const price = STRIPE_PRICES[plan];
    if (!price) return res.status(400).json({ error: 'missing_price_id' });

    const userRef = adminDb.collection('users').doc(user.uid);
    const snapshot = await userRef.get();
    const userData = snapshot.exists ? snapshot.data() : {};
    let customerId = userData?.billing?.stripeCustomerId || userData?.stripeCustomerId || '';

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: userData?.profile?.name || user.name || '',
        metadata: { uid: user.uid, app: 'anareQ' }
      });
      customerId = customer.id;
      await userRef.set({
        billing: { stripeCustomerId: customerId },
        stripeCustomerId: customerId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.uid,
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${APP_URL}/app?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/app?billing=cancelled`,
      metadata: { uid: user.uid, plan },
      subscription_data: { metadata: { uid: user.uid, plan } }
    });

    await userRef.set({
      billing: {
        stripeCustomerId: customerId,
        lastCheckoutSessionId: session.id,
        lastRequestedPlan: plan
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('create-checkout-session error:', error);
    return res.status(error.statusCode || 500).json({ error: error.message || 'checkout_failed' });
  }
}
