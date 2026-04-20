import type { Request } from "express";
import type { DeleteUserUseCase } from "../../use-cases/user/delete-user.js";

import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import {
  userNotFoundResponse,
  serverError,
  successResponse,
} from "../helpers/index.js";

export interface DeleteUserParams {
  userId: string;
}

export class DeleteUserController {
  constructor(private deleteUserUserCase: DeleteUserUseCase) {
    this.deleteUserUserCase = deleteUserUserCase;
  }
  async execute(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const deletedUser = await this.deleteUserUserCase.execute(userId);

      if (!deletedUser) {
        return userNotFoundResponse();
      }

      return successResponse(deletedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
      return serverError();
    }
  }
}
