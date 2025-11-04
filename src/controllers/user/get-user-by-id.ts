import type { Request } from "express";
import type { GetUserByIdUseCase } from "../../use-cases/user/get-user-by-id.js";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation.js";
import { badRequest, serverError, successResponse } from "../helpers/http.js";

export class GetUserByIdController {
  constructor(private getUserByIdUseCase: GetUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(httpRequest: Request) {
    try {
      const userId = httpRequest.params.userId;

      if (!userId) {
        return badRequest("User id is required.");
      }

      const isUserIdValid = checkIfIdIsValid(userId);

      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(userId);

      return successResponse(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
