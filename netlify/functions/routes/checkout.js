import { Router } from "express";
import Stripe from "stripe";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

router.post("/checkout/session", async (req, res) => {
  try {
    const {
      priceId,
      quantity = 1,
      lineItems,
      mode = "payment",
      successUrl,
      cancelUrl,
      customerEmail,
    } = req.body || {};

    let items;
    if (Array.isArray(lineItems) && lineItems.length > 0) {
      items = lineItems;
    } else if (priceId) {
      items = [{ price: priceId, quantity }];
    } else {
      return res.status(400).json({ error: "Provide priceId or lineItems[]" });
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: items,
      success_url:
        successUrl ||
        process.env.STRIPE_SUCCESS_URL ||
        process.env.DEPLOY_PRIME_URL + "/success" ||
        "http://localhost:8888/success",
      cancel_url:
        cancelUrl ||
        process.env.STRIPE_CANCEL_URL ||
        process.env.DEPLOY_PRIME_URL + "/cancel" ||
        "http://localhost:8888/cancel",
      customer_email: customerEmail,
      billing_address_collection: "auto",
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Failed to create session" });
  }
});

export default router;
