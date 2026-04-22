import type { Request } from "express";
import type { LoginUserUseCase } from "../../use-cases/user/login-user.js";
import { loginSchema } from "../../schemas/user.js";
import {
  badRequest,
  serverError,
  successResponse,
  unauthorized,
} from "../helpers/http.js";
import { ZodError } from "zod";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../errors/user.js";

export class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const params = httpRequest.body;
      await loginSchema.parseAsync(params);

      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password,
      );

      return successResponse(user);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      if (
        error instanceof UserNotFoundError ||
        error instanceof InvalidCredentialsError
      ) {
        return unauthorized("Invalid email or password");
      }

      return serverError();
    }
  }
}
