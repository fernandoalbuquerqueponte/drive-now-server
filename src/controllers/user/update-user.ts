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

interface UpdateUserRequest {
  userId: string;
  body: UpdateUserSchema;
}

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest: UpdateUserRequest) {
    try {
      const { userId, body } = httpRequest;
      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }
      await updateUserSchema.parseAsync(body);

      const updatedUser = await this.updateUserUseCase.execute(userId, body);

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
