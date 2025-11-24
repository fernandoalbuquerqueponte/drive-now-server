import type { Request } from "express";
import type { UpdateUserUseCase } from "../../use-cases/user/update-user.js";
import { ZodError } from "zod";

import { updateUserSchema } from "../../schemas/user.js";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import { badRequest, serverError } from "../helpers/http.js";
import { UserAlreadyExistsError } from "../../errors/user.js";

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId as string;
      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;
      await updateUserSchema.parseAsync(params);

      const updatedUser = await this.updateUserUseCase.execute(userId, params);

      return updatedUser;
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      if (error instanceof UserAlreadyExistsError) {
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
