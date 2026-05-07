import express, { type Request, type Response } from "express";
import { auth } from "../middlewares /auth.js";
import {
  makeCreateCheckoutSessionController,
  makeHandleStripeWebhookController,
} from "../factories/controllers/payment.js";

export const paymentRoutes = express.Router();

paymentRoutes.post("/checkout", auth, async (req: Request, res: Response) => {
  const { bookingId } = req.body;

  if (!bookingId || typeof bookingId !== "string") {
    return res.status(400).send({ message: "bookingId is required" });
  }

  const controller = makeCreateCheckoutSessionController();
  const response = await controller.execute({ body: { bookingId } });

  return res.status(response.statusCode).send(response.body);
});

paymentRoutes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const controller = makeHandleStripeWebhookController();

    const response = await controller.execute({
      body: req.body,
      stripeSignature: signature,
    });

    return res.status(response.statusCode).send(response.body);
  },
);
