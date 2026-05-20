/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UpdateUserUseCase } from "../../use-cases/user/update-user.js";
import { ZodError } from "zod";

import { updateUserSchema, type UpdateUserSchema } from "../../schemas/user.js";
import {
  badRequest,
  serverError,
  successResponse,
  checkIfIdIsValid,
  invalidIdResponse,
} from "../helpers/index.js";
import { UserAlreadyExistsError } from "../../errors/user.js";
import { uploadToCloudinary } from "../../middlewares/multer.js";

interface UpdateUserRequest {
  userId: string;
  body: UpdateUserSchema;
  files?: any;
}

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest: UpdateUserRequest) {
    try {
      const { userId, body } = httpRequest;
      const files = httpRequest.files;
      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      if (files && files["imageUrl"] && files["imageUrl"][0]) {
        body.imageUrl = await uploadToCloudinary(
          files["imageUrl"][0].buffer,
          "drive-now-uploads",
        );
      }

      const validatedUser = await updateUserSchema.parseAsync(body);

      const updatedUser = await this.updateUserUseCase.execute(
        userId,
        validatedUser,
      );

      return successResponse(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      if (error instanceof UserAlreadyExistsError) {
        return badRequest(error.message);
      }

      console.error(error);

      return serverError();
    }
  }
}
