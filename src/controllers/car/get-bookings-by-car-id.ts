import type { GetBookingsByCarIdUseCase } from "../../use-cases/car/get-bookings-by-car-id.js";
import { serverError, successResponse } from "../helpers/http.js";

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
      const carId = httpRequest.params.carId;

      const bookings = await this.getBookingsByCarIdUseCase.execute(carId);

      return successResponse(bookings);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
