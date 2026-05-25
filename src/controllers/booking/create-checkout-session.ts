import type { CreateCheckoutSessionUseCase } from "../../use-cases/booking/create-checkout-session.js";

export interface CreateCheckoutHttpRequest {
  body: {
    bookingId: string;
  };
}

export class CreateCheckoutSessionController {
  constructor(
    private createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
  ) {}

  async execute(request: CreateCheckoutHttpRequest) {
    const { bookingId } = request.body;

    const result = await this.createCheckoutSessionUseCase.execute(bookingId);

    return {
      body: result,
      statusCode: 200,
    };
  }
}
