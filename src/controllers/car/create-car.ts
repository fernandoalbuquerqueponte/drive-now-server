import type { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { badRequest, created, serverError } from "../helpers/index.js";
import { createCarSchema, type CreateCarSchema } from "../../schemas/car.js";
import { ZodError } from "zod";

interface HttpRequest {
  body: CreateCarSchema;
  userId: string;
}

export class CreateCarController {
  constructor(private createCarUseCase: CreateCarUseCase) {
    this.createCarUseCase = createCarUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;
      const userId = httpRequest.userId;

      if (!userId) {
        return badRequest("User ID is required.");
      }

      const validatedData = await createCarSchema.parseAsync(params);

      const createdCar = await this.createCarUseCase.execute(
        validatedData,
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
