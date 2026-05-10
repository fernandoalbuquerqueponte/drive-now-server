import { CreateCheckoutSessionController } from "../../controllers/booking/create-checkout-session.js";
import { HandleStripeWebhookController } from "../../controllers/booking/handle-stripe-webhook.js";
import { PostgresBookingUpdateStatusRepository } from "../../repositories/postgres/booking/booking-update-status.js";
import { PostgresFindBooking } from "../../repositories/postgres/car/find-booking.js";
import { CreateCheckoutSessionUseCase } from "../../use-cases/booking/create-checkout-session.js";
import { HandleStripeWebhookUseCase } from "../../use-cases/booking/handle-stripe-webhook.js";

export const makeCreateCheckoutSessionController = () => {
  const findBookingRepository = new PostgresFindBooking();
  const useCase = new CreateCheckoutSessionUseCase(findBookingRepository);
  return new CreateCheckoutSessionController(useCase);
};

export const makeHandleStripeWebhookController = () => {
  const bookingUpdateStatusRepository =
    new PostgresBookingUpdateStatusRepository();
  const useCase = new HandleStripeWebhookUseCase(bookingUpdateStatusRepository);
  return new HandleStripeWebhookController(useCase);
};
