import type { GetBookingsCarByUserIdUseCase } from "../../use-cases/car/get-bookings-car-by-user-id.js";
import { serverError, successResponse } from "../helpers/http.js";

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
      const bookings = await this.getBookingsCarByUserIdUseCase.execute(
        httpRequest.userId,
      );

      return successResponse(bookings);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
