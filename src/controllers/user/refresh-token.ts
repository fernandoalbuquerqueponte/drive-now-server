import { badRequest, serverError, successResponse } from "../helpers/index.js";
import { ZodError } from "zod";
import type { Request } from "express";
import type { RefreshTokenUseCase } from "../../use-cases/user/refresh-token.js";
import { refreshTokenSchema } from "../../schemas/user.js";

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

      console.error(error);

      return serverError();
    }
  }
}
