import type { Request } from "express";
import type { DeleteCarUseCase } from "../../use-cases/car/delete-car.js";
import { deleteCarSchema } from "../../schemas/car.js";
import { CarNotFoundError } from "../../errors/car.js";
import {
  badRequest,
  carNotFoundResponse,
  serverError,
  successResponse,
} from "../helpers/index.js";
import { ZodError } from "zod";

export class DeleteCarController {
  constructor(private deleteCarUseCase: DeleteCarUseCase) {
    this.deleteCarUseCase = deleteCarUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const carId = httpRequest.params.carId as string;

      await deleteCarSchema.parseAsync({ carId });

      const carDeleted = await this.deleteCarUseCase.execute(carId);

      return successResponse(carDeleted);
    } catch (error) {
      if (error instanceof CarNotFoundError) {
        return carNotFoundResponse();
      }

      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      console.error(error);
      return serverError();
    }
  }
}
