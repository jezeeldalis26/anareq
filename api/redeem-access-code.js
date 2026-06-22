import { adminDb, FieldValue, requireUser, readJsonBody } from './_firebaseAdmin.js';

const DAY_MS = 24 * 60 * 60 * 1000;

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  return 0;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const user = await requireUser(req);
    const body = await readJsonBody(req);
    const normalizedCode = String(body.code || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!normalizedCode) return res.status(400).json({ error: 'missing_code' });

    const result = await adminDb.runTransaction(async (transaction) => {
      const codeRef = adminDb.collection('accessCodes').doc(normalizedCode);
      const userRef = adminDb.collection('users').doc(user.uid);
      const codeSnap = await transaction.get(codeRef);
      if (!codeSnap.exists) throw new Error('invalid_code');
      const codeData = codeSnap.data() || {};

      if (codeData.active === false) throw new Error('inactive_code');
      if (toMillis(codeData.expiresAt) && toMillis(codeData.expiresAt) <= Date.now()) throw new Error('expired_code');
      const maxRedemptions = Number(codeData.maxRedemptions || 1);
      const redeemedCount = Number(codeData.redeemedCount || 0);
      if (redeemedCount >= maxRedemptions) throw new Error('redeemed_code');
      if (codeData.assignedEmail && String(codeData.assignedEmail).toLowerCase() !== String(user.email || '').toLowerCase()) throw new Error('assigned_code');

      const durationDays = Number(codeData.durationDays || 0);
      const type = codeData.type || (durationDays > 0 ? 'days' : 'lifetime');
      const promoAccessEndsAt = type === 'lifetime' || durationDays <= 0
        ? null
        : new Date(Date.now() + (durationDays * DAY_MS)).toISOString();
      const nowIso = new Date().toISOString();

      const accessState = {
        subscriptionStatus: 'promo',
        accessSource: 'promo',
        planType: codeData.planType || type,
        promoCodeUsed: normalizedCode,
        promoAccessEndsAt,
        updatedAt: nowIso,
        billing: {
          promoCodeUsed: normalizedCode,
          promoType: type,
          promoDurationDays: durationDays || null,
          promoRedeemedAt: nowIso
        }
      };

      transaction.set(userRef, accessState, { merge: true });
      transaction.set(codeRef, {
        redeemedCount: FieldValue.increment(1),
        lastRedeemedAt: nowIso,
        redemptions: FieldValue.arrayUnion({ uid: user.uid, email: user.email || '', redeemedAt: nowIso })
      }, { merge: true });

      return accessState;
    });

    return res.status(200).json({ accessState: result });
  } catch (error) {
    console.error('redeem-access-code error:', error);
    return res.status(error.statusCode || 400).json({ error: error.message || 'redeem_failed' });
  }
}
