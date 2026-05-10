import { CreateCheckoutSessionController } from "../../controllers/booking/create-checkout-session.js";
import { HandleStripeWebhookController } from "../../controllers/booking/handle-stripe-webhook.js";
import { PostgresBookingUpdateStatusRepository } from "../../repositories/postgres/booking/booking-update-status.js";
import { PostgresBookingRepository } from "../../repositories/postgres/booking/booking.js";
import { CreateCheckoutSessionUseCase } from "../../use-cases/booking/create-checkout-session.js";
import { HandleStripeWebhookUseCase } from "../../use-cases/booking/handle-stripe-webhook.js";

export const makeCreateCheckoutSessionController = () => {
  const repository = new PostgresBookingRepository();
  const useCase = new CreateCheckoutSessionUseCase(repository);
  return new CreateCheckoutSessionController(useCase);
};

export const makeHandleStripeWebhookController = () => {
  const bookingUpdateStatusRepository =
    new PostgresBookingUpdateStatusRepository();
  const useCase = new HandleStripeWebhookUseCase(bookingUpdateStatusRepository);
  return new HandleStripeWebhookController(useCase);
};
