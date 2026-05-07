import Stripe from "stripe";
import type { PostgresBookingRepository } from "../../repositories/postgres/booking/booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class HandleStripeWebhookUseCase {
  constructor(private bookingRepository: PostgresBookingRepository) {}

  async execute(rawBody: Buffer, stripeSignature: string) {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await this.bookingRepository.updateStatus(bookingId, "CONFIRMED");
      }
    }

    return { received: true };
  }
}
