/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UpdateCarUseCase } from "../../use-cases/car/update-car.js";
import {
  badRequest,
  carNotFoundResponse,
  serverError,
  successResponse,
} from "../helpers/index.js";
import {
  updateCarParamsSchema,
  updateCarSchema,
  type UpdateCarSchema,
} from "../../schemas/car.js";
import { ForbiddenError } from "../../errors/user.js";
import { ZodError } from "zod";
import { CarNotFoundError } from "../../errors/car.js";

interface HttpRequest {
  body: UpdateCarSchema;
  userId: string;
  carId: string;
  files?: any;
}

export class UpdateCarController {
  constructor(private updateCarUseCase: UpdateCarUseCase) {
    this.updateCarUseCase = updateCarUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const { carId, userId } = updateCarParamsSchema.parse(httpRequest);

      const params = { ...httpRequest.body };
      const files = httpRequest.files;

      if (files && files["image"] && files["image"][0]) {
        params.image = `http://localhost:3333/uploads/${files["image"][0].filename}`;
      }

      if (files && files["gallery"]) {
        params.gallery = files["gallery"].map(
          (file: any) => `http://localhost:3333/uploads/${file.filename}`,
        );
      }

      const validatedData = await updateCarSchema.parseAsync(params);

      const updatedCar = await this.updateCarUseCase.execute(
        carId,
        validatedData,
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

      if (error instanceof CarNotFoundError) {
        return carNotFoundResponse();
      }

      return serverError();
    }
  }
}
