import type { Request } from "express";
import { createUserSchema } from "../../schemas/user.js";
import type { CreateUserUseCase } from "../../use-cases/index.js";
import { badRequest, created, serverError } from "../helpers/http.js";
import { UserAlreadyExistsError } from "../../errors/user.js";
import { ZodError } from "zod";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest: Request) {
    try {
      const params = httpRequest.body;

      createUserSchema.parse(params);

      const user = await this.createUserUseCase.execute(params);

      return created(user);
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
