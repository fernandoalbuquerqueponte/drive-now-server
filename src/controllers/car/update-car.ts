import type { Request } from "express";
import type { UpdateCarUseCase } from "../../use-cases/car/update-car.js";
import {
  badRequest,
  serverError,
  successResponse,
  checkIfIdIsValid,
  invalidIdResponse,
} from "../helpers/index.js";
import { updateCarParamsSchema, updateCarSchema } from "../../schemas/car.js";
import { ForbiddenError } from "../../errors/user.js";
import { ZodError } from "zod/v3";

export class UpdateCarController {
  constructor(private updateCarUseCase: UpdateCarUseCase) {
    this.updateCarUseCase = updateCarUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const { carId, userId } = updateCarParamsSchema.parse(httpRequest.params);

      const data = httpRequest.body;

      await updateCarSchema.parseAsync(data);

      const updatedCar = await this.updateCarUseCase.execute(
        carId,
        data,
        userId,
      );
      return successResponse(updatedCar);
    } catch (error) {
      console.error(error);
      if (error instanceof ForbiddenError) {
        return badRequest("You do not have permission to update this car.");
      }

      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      return serverError();
    }
  }
}
