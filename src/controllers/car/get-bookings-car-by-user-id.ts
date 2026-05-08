import { getBookingsByUserIdSchema } from "../../schemas/booking.js";
import type { GetBookingsCarByUserIdUseCase } from "../../use-cases/car/get-bookings-car-by-user-id.js";
import { badRequest, serverError, successResponse } from "../helpers/http.js";
import { ZodError } from "zod";

interface HttpRequest {
  userId: string;
}

export class GetBookingsCarByUserIdController {
  constructor(
    private getBookingsCarByUserIdUseCase: GetBookingsCarByUserIdUseCase,
  ) {
    this.getBookingsCarByUserIdUseCase = getBookingsCarByUserIdUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      await getBookingsByUserIdSchema.parseAsync(httpRequest);

      const bookings = await this.getBookingsCarByUserIdUseCase.execute(
        httpRequest.userId,
      );

      return successResponse(bookings);
    } catch (error) {
      console.error(error);

      if (error instanceof ZodError) {
        return badRequest(error.message);
      }
      return serverError();
    }
  }
}
