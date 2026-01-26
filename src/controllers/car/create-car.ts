import type { Request } from "express";
import type { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { badRequest, created, serverError } from "../helpers/index.js";
import { createCarSchema } from "../../schemas/car.js";
import { ZodError } from "zod/v3";

export class CreateCarController {
  constructor(private createCarUseCase: CreateCarUseCase) {
    this.createCarUseCase = createCarUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const params = httpRequest.body;
      const userId = httpRequest.params.userId;

      if (!userId) {
        return badRequest("User ID is required.");
      }

      await createCarSchema.parseAsync(params);

      const createdCar = await this.createCarUseCase.execute(
        httpRequest.body,
        userId,
      );
      return created(createdCar);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }
      return serverError();
    }
  }
}
