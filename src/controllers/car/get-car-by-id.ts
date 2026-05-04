import type { Request } from "express";
import type { GetCarByIdUseCase } from "../../use-cases/car/get-car-by-id.js";
import { badRequest, serverError, successResponse } from "../helpers/http.js";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import { carNotFoundResponse } from "../helpers/car.js";
import { CarNotFoundError } from "../../errors/car.js";

interface HttpRequest {
  carId: string;
}

export class GetCarByIdController {
  constructor(private getCarByIdUseCase: GetCarByIdUseCase) {
    this.getCarByIdUseCase = getCarByIdUseCase;
  }

  async execute(httpRequest: HttpRequest | Request) {
    try {
      const carId =
        "carId" in httpRequest
          ? httpRequest.carId
          : (httpRequest.params.carId as string);

      if (!carId) {
        return badRequest("Car ID is required.");
      }

      const isIdValid = checkIfIdIsValid(carId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const car = await this.getCarByIdUseCase.execute(carId);

      return successResponse(car);
    } catch (error) {
      console.error(error);
      if (error instanceof CarNotFoundError) {
        return carNotFoundResponse();
      }

      return serverError();
    }
  }
}
