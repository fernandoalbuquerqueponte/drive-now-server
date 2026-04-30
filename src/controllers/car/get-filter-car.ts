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
  userId: string;
}

export class GetFilterCarController {
  constructor(private getFilterCarUseCase: GetFilterCarUseCase) {}

  async handle(httpRequest: HttpRequest) {
    try {
      const { search, category, priceRange, transmission, fuel } =
        httpRequest.query;

      const cars = await this.getFilterCarUseCase.execute({
        search: search as string,
        category: category as string,
        priceRange: priceRange as string,
        transmission: transmission as string,
        fuel: fuel as string,
      });

      return successResponse(cars);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
