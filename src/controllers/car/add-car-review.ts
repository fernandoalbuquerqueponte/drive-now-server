import type { Request } from "express";
import type { AddCarReviewUseCase } from "../../use-cases/car/add-car-review.js";
import {
  badRequest,
  created,
  serverError,
  checkIfIdIsValid,
  carNotFoundResponse,
} from "../helpers/index.js";
import { createReviewSchema } from "../../schemas/car.js";
import { CarNotFoundError } from "../../errors/car.js";
import { ZodError } from "zod/v3";
import type { CreateReviewDTO } from "../../types/car.js";

interface HttpRequest {
  userId: string;
  carId: string;
  body: CreateReviewDTO;
}

export class AddCarReviewController {
  constructor(private addCarReviewUseCase: AddCarReviewUseCase) {
    this.addCarReviewUseCase = addCarReviewUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const { body, carId, userId } = httpRequest;

      await createReviewSchema.parseAsync(body);

      if (!carId || !userId) {
        return badRequest("Missing carId or userId");
      }

      const isCarIdValid = checkIfIdIsValid(carId);
      if (!isCarIdValid) {
        return badRequest("Invalid carId format");
      }

      const isUserIdValid = checkIfIdIsValid(userId);
      if (!isUserIdValid) {
        return badRequest("Invalid userId format");
      }

      const createdReview = await this.addCarReviewUseCase.execute(
        carId,
        userId,
        body,
      );

      return created(createdReview);
    } catch (error) {
      console.error(error);
      if (error instanceof CarNotFoundError) {
        return carNotFoundResponse();
      }

      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      return serverError();
    }
  }
}
