import type { HandleStripeWebhookUseCase } from "../../use-cases/booking/handle-stripe-webhook.js";

export class HandleStripeWebhookController {
  constructor(private handleStripeWebhookUseCase: HandleStripeWebhookUseCase) {}

  async execute(request: { body: Buffer; stripeSignature?: string }) {
    const { body, stripeSignature } = request;

    if (!stripeSignature) {
      return {
        statusCode: 400,
        body: { message: "No stripe signature found" },
      };
    }

    const result = await this.handleStripeWebhookUseCase.execute(
      body,
      stripeSignature,
    );

    return {
      statusCode: 200,
      body: result,
    };
  }
}
