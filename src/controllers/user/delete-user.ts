import type { DeleteUserUseCase } from "../../use-cases/user/delete-user.js";

import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import {
  userNotFoundResponse,
  serverError,
  successResponse,
} from "../helpers/index.js";

interface HttpRequest {
  userId: string;
}

export class DeleteUserController {
  constructor(private deleteUserUserCase: DeleteUserUseCase) {
    this.deleteUserUserCase = deleteUserUserCase;
  }
  async execute(httpRequest: HttpRequest) {
    try {
      const userId = httpRequest.userId;

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
