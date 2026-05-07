import Stripe from "stripe";

export const createStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  return new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
};
