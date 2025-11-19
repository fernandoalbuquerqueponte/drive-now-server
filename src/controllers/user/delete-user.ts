import type { Request } from "express";
import type { DeleteUserUseCase } from "../../use-cases/user/delete-user.js";

import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import { userNotFoundResponse, ok, serverError } from "../helpers/index.js";

export interface DeleteUserParams {
  userId: string;
}

export class DeleteUserController {
  constructor(private deleteUserUserCase: DeleteUserUseCase) {
    this.deleteUserUserCase = deleteUserUserCase;
  }
  async execute(httpRequest: Request<DeleteUserParams>) {
    try {
      const userId = httpRequest.params.userId;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const deletedUser = await this.deleteUserUserCase.execute(userId);

      if (!deletedUser) {
        return userNotFoundResponse();
      }

      return ok();
    } catch (error) {
      console.error("Error deleting user:", error);
      return serverError();
    }
  }
}
