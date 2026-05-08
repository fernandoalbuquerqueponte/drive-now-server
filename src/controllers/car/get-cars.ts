import { badRequest, serverError, successResponse } from "../helpers/http.js";
import type { GetCarsUseCase } from "../../use-cases/car/get-cars.js";
import { getCarsSchema } from "../../schemas/car.js";
import { ZodError } from "zod";

interface HttpRequest {
  query?: {
    search?: string;
    category?: string;
    priceRange?: string;
    transmission?: string;
    fuel?: string;
  };
}

export class GetCarsController {
  constructor(private readonly getCarsUseCase: GetCarsUseCase) {}

  async execute(httpRequest: HttpRequest) {
    try {
      const { query } = await getCarsSchema.parseAsync(httpRequest);

      const filters = query || {};

      const cars = await this.getCarsUseCase.execute(filters);

      return successResponse(cars);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);

      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      return serverError();
    }
  }
}
