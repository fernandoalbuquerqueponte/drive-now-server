import type { Request } from "express";
import type { GetCarReviewsUseCase } from "../../use-cases/car/get-car-reviews.js";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import { badRequest, serverError, successResponse } from "../helpers/http.js";

export class GetCarReviewsController {
  constructor(private getCarReviewsUseCase: GetCarReviewsUseCase) {
    this.getCarReviewsUseCase = getCarReviewsUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const carId = httpRequest.params.carId;

      if (!carId) {
        return badRequest("Car ID is required.");
      }

      const isIdValid = checkIfIdIsValid(carId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const reviews = await this.getCarReviewsUseCase.execute(carId);

      return successResponse(reviews);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
