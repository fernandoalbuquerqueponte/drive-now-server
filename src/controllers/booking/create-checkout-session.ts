/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CreateCheckoutSessionUseCase } from "../../use-cases/booking/create-checkout-session.js";

export class CreateCheckoutSessionController {
  constructor(
    private createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
  ) {}

  async execute(request: { body: any }) {
    const { bookingId } = request.body;

    const result = await this.createCheckoutSessionUseCase.execute(bookingId);

    return {
      body: result,
      statusCode: 200,
    };
  }
}
