import Stripe from "stripe";
import { createStripeClient } from "../../adapters/stripe.js";
import type { PostgresBookingUpdateStatusRepository } from "../../repositories/postgres/booking/booking-update-status.js";

export class HandleStripeWebhookUseCase {
  private readonly stripe = createStripeClient();

  constructor(
    private bookingUpdateStatus: PostgresBookingUpdateStatusRepository,
  ) {}

  async execute(rawBody: Buffer, stripeSignature: string) {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await this.bookingUpdateStatus.execute(bookingId, "CONFIRMED");
      }
    }

    return { received: true };
  }
}
