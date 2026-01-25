import type { Request } from "express";
import { badRequest, created, serverError } from "../helpers/http.js";
import type { ReserveCarUseCase } from "../../use-cases/car/reserve-car.js";
import { checkIfIdIsValid } from "../helpers/validation.js";
import { createReserveSchema } from "../../schemas/car.js";

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

      console.log(created(createdBooking));
      return created(createdBooking);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
