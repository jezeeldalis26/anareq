import Stripe from "stripe";

function parseBody(req) {
  if (!req.body) return {};

  if (typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Use POST to create a Stripe Checkout session."
    });
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    const monthlyPrice =
      process.env.STRIPE_PRICE_MONTHLY ||
      process.env.VITE_STRIPE_PRICE_MONTHLY;

    const yearlyPrice =
      process.env.STRIPE_PRICE_YEARLY ||
      process.env.VITE_STRIPE_PRICE_YEARLY;

    const appUrl =
      process.env.APP_URL ||
      process.env.VITE_APP_URL ||
      "https://anareq.com";

    if (!stripeSecretKey) {
      return res.status(500).json({
        error: "missing_stripe_secret_key"
      });
    }

    const body = parseBody(req);
    const plan = body.plan === "yearly" ? "yearly" : "monthly";
    const price = plan === "yearly" ? yearlyPrice : monthlyPrice;

    if (!price || !price.startsWith("price_")) {
      return res.status(500).json({
        error: "missing_or_invalid_price_id",
        plan,
        hint: "Use Stripe Price IDs that start with price_, not Product IDs that start with prod_."
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price,
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      success_url: `${appUrl}/app?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/app?billing=cancelled`,
      customer_email:
        body.email && String(body.email).includes("@") ? body.email : undefined,
      client_reference_id: body.uid || undefined,
      metadata: {
        app: "anareQ",
        plan,
        uid: body.uid || ""
      },
      subscription_data: {
        metadata: {
          app: "anareQ",
          plan,
          uid: body.uid || ""
        }
      }
    });

    return res.status(200).json({
      url: session.url
    });
  } catch (error) {
    console.error("create-checkout-session error:", error);

    return res.status(500).json({
      error: "checkout_failed",
      message: error.message || "Unknown Stripe checkout error"
    });
  }
}