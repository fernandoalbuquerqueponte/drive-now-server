import type { Request } from "express";
import {
  badRequest,
  created,
  serverError,
  checkIfIdIsValid,
} from "../helpers/index.js";
import type { ReserveCarUseCase } from "../../use-cases/car/reserve-car.js";
import { createReserveSchema } from "../../schemas/car.js";
import { CarNotFoundError } from "../../errors/car.js";
import { ZodError } from "zod/v3";

export class ReserveCarController {
  constructor(private reserveCarUseCase: ReserveCarUseCase) {
    this.reserveCarUseCase = reserveCarUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const params = httpRequest.body;
      const carId = httpRequest.params.carId;
      const userId = httpRequest.params.userId;

      await createReserveSchema.parseAsync(params);

      if (!carId || !userId) {
        return badRequest("Missing carId or userId");
      }

      const isCarIdValid = checkIfIdIsValid(carId);
      if (!isCarIdValid) {
        return badRequest("Invalid carId format");
      }

      const createdBooking = await this.reserveCarUseCase.execute(
        carId,
        userId,
        params,
      );

      return created(createdBooking);
    } catch (error) {
      console.error(error);
      if (error instanceof CarNotFoundError) {
        return badRequest("Car not found");
      }

      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      return serverError();
    }
  }
}
