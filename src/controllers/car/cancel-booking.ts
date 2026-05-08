import type { CancelBookingUseCase } from "../../use-cases/car/cancel-booking.js";
import { BookingNotFound } from "../../errors/car.js";
import { bookingNotFoundResponse } from "../helpers/booking.js";
import { cancelBookingSchema } from "../../schemas/booking.js";
import { ZodError } from "zod";
import { badRequest, serverError, successResponse } from "../helpers/http.js";

interface httpRequest {
  userId: string;
  params: {
    bookingId: string;
  };
}

export class CancelBookingController {
  constructor(private cancelBookingUseCase: CancelBookingUseCase) {}
  async execute(httpRequest: httpRequest) {
    try {
      await cancelBookingSchema.parseAsync(httpRequest);

      const userId = httpRequest.userId;
      const bookingId = httpRequest.params.bookingId;

      const booking = await this.cancelBookingUseCase.execute(
        bookingId,
        userId,
      );

      return successResponse(booking);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      if (error instanceof BookingNotFound) {
        return bookingNotFoundResponse();
      }

      return serverError();
    }
  }
}
