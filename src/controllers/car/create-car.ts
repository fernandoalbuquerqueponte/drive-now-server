/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { badRequest, created, serverError } from "../helpers/index.js";
import { createCarSchema } from "../../schemas/car.js";
import { ZodError } from "zod";
import { uploadToCloudinary } from "../../middlewares/multer.js";

interface HttpRequest {
  body: any;
  userId: string;
  files?: any;
}

export class CreateCarController {
  constructor(private createCarUseCase: CreateCarUseCase) {
    this.createCarUseCase = createCarUseCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const params = { ...httpRequest.body };
      const userId = httpRequest.userId;
      const files = httpRequest.files;

      if (!userId) {
        return badRequest("User ID is required.");
      }

      if (files && files["image"] && files["image"][0]) {
        params.image = await uploadToCloudinary(
          files["image"][0].buffer,
          "drive-now-uploads",
        );
      }

      if (files && files["gallery"]) {
        params.gallery = await Promise.all(
          files["gallery"].map(async (file: any) => {
            return await uploadToCloudinary(file.buffer, "drive-now-uploads");
          }),
        );
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
