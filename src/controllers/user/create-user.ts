import type { Request } from "express";
import type { ICreateUserUseCase } from "../../types/user.js";
import { createUserSchema } from "../../schemas/user.js";

export class CreateUserController {
  constructor(private createUserUseCase: ICreateUserUseCase) {
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
      throw new Error("Erro ao criar usuário");
    }
  }
}
