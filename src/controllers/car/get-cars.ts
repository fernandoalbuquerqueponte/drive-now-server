import { serverError, successResponse } from "../helpers/http.js";
import type { GetCarsUseCase } from "../../use-cases/car/get-cars.js";

export class GetCarsController {
  constructor(private getCarsUseCase: GetCarsUseCase) {
    this.getCarsUseCase = getCarsUseCase;
  }
  async execute() {
    try {
      const cars = await this.getCarsUseCase.execute();

      return successResponse(cars);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
