import type { GetFilterCarUseCase } from "../../use-cases/car/get-filter-car.js";
import { serverError, successResponse } from "../helpers/http.js";
interface HttpRequest {
  query: {
    search: string;
    category: string;
    priceRange: string;
    transmission: string;
    fuel: string;
  };
}

export class GetFilterCarController {
  constructor(private getFilterCarUseCase: GetFilterCarUseCase) {}

  async execute(httpRequest: HttpRequest) {
    try {
      const cars = await this.getFilterCarUseCase.execute(httpRequest.query);

      return successResponse(cars);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
