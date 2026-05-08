import {
  badRequest,
  created,
  serverError,
  checkIfIdIsValid,
  carNotFoundResponse,
} from "../helpers/index.js";
import type { ReserveCarUseCase } from "../../use-cases/car/reserve-car.js";
import { createReserveSchema } from "../../schemas/car.js";
import { CarNotFoundError } from "../../errors/car.js";
import { ZodError } from "zod";
import type { ReserveCarInputDTO } from "../../types/car.js";

interface httpRequest {
  userId: string;
  carId: string;
  body: ReserveCarInputDTO;
}

export class ReserveCarController {
  constructor(private reserveCarUseCase: ReserveCarUseCase) {
    this.reserveCarUseCase = reserveCarUseCase;
  }
  async execute(httpRequest: httpRequest) {
    try {
      const params = httpRequest.body;
      const carId = httpRequest.carId;

      const userId = httpRequest.userId;

      await createReserveSchema.parseAsync(params);

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

      const createdBooking = await this.reserveCarUseCase.execute(
        carId,
        userId,
        params,
      );

      return created(createdBooking);
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
