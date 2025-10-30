import type { Request } from "express";
import { createUserSchema } from "../../schemas/user.js";
import type { CreateUserUseCase } from "../../use-cases/index.js";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest: Request) {
    try {
      const params = httpRequest.body;

      createUserSchema.parse(params);

      const user = await this.createUserUseCase.execute(params);

      return {
        statusCode: 201,
        body: user,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao criar usuário");
    }
  }
}
