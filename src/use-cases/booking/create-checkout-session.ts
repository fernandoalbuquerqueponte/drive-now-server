import { createStripeClient } from "../../adapters/stripe.js";
import type { PostgresFindBooking } from "../../repositories/postgres/car/find-booking.js";

export class CreateCheckoutSessionUseCase {
  private readonly stripe = createStripeClient();

  constructor(private findBookingRepository: PostgresFindBooking) {}

  async execute(bookingId: string) {
    const booking = await this.findBookingRepository.execute(bookingId);

    if (!booking) {
      throw new Error("Reserva não encontrada");
    }

    const totalAmountInCents = Math.round(booking.totalPrice * 100);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Reserva de ${booking.car.model}`,
              description: `Total de ${booking.totalHours} hora(s)`,
            },
            unit_amount: totalAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        bookingId,
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return { url: session.url };
  }
}
