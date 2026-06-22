import { adminDb, requireUser } from './_firebaseAdmin.js';
import { APP_URL, stripe } from './_stripe.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const user = await requireUser(req);
    const snapshot = await adminDb.collection('users').doc(user.uid).get();
    const userData = snapshot.exists ? snapshot.data() : {};
    const customerId = userData?.billing?.stripeCustomerId || userData?.stripeCustomerId;
    if (!customerId) return res.status(400).json({ error: 'missing_customer' });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/app`
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('create-portal-session error:', error);
    return res.status(error.statusCode || 500).json({ error: error.message || 'portal_failed' });
  }
}
