import {
  badRequest,
  serverError,
  successResponse,
  unauthorized,
} from "../helpers/index.js";
import { ZodError } from "zod";
import type { Request } from "express";
import type { RefreshTokenUseCase } from "../../use-cases/user/refresh-token.js";
import { refreshTokenSchema } from "../../schemas/user.js";
import { ForbiddenError } from "../../errors/user.js";

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }
  async execute(httpRequest: Request) {
    try {
      const params = httpRequest.body;

      await refreshTokenSchema.parseAsync(params);

      const response = await this.refreshTokenUseCase.execute(
        params.refreshToken,
      );

      return successResponse(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(error.message);
      }

      if (error instanceof ForbiddenError) {
        return unauthorized("Invalid refresh token");
      }

      console.error(error);

      return serverError();
    }
  }
}
