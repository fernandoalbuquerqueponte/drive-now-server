import { getBookingsByCarIdSchema } from "../../schemas/booking.js";
import type { GetBookingsByCarIdUseCase } from "../../use-cases/car/get-bookings-by-car-id.js";
import { badRequest, serverError, successResponse } from "../helpers/http.js";
import { ZodError } from "zod";

interface httpRequest {
  params: {
    carId: string;
  };
}

export class GetBookingsByCarIdController {
  constructor(private getBookingsByCarIdUseCase: GetBookingsByCarIdUseCase) {
    this.getBookingsByCarIdUseCase = getBookingsByCarIdUseCase;
  }
  async execute(httpRequest: httpRequest) {
    try {
      await getBookingsByCarIdSchema.parseAsync(httpRequest);
      const carId = httpRequest.params.carId;

      const bookings = await this.getBookingsByCarIdUseCase.execute(carId);

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
