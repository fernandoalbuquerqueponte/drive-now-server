/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { LoginUserController } from "../../../controllers/user/login-user.js";
import type { LoginUserUseCase } from "../../../use-cases/user/login-user.js";

describe("LoginUserController", () => {
  class LoginUserUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: "inaap9084@gmail.com",
        password: "hashed_password",
        imageUrl: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tokens: {
          accessToken: "any_access_token",
          refreshToken: "any_refresh_token",
        },
      };
    }
  }

  const makeSut = () => {
    const loginUserUseCase =
      new LoginUserUseCaseStub() as unknown as LoginUserUseCase;

    const sut = new LoginUserController(loginUserUseCase);

    return {
      sut,
      loginUserUseCase,
    };
  };

  const httpRequest = {
    body: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  };

  it("should return 200 and tokens on success login", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest as any);

    const body = response.body as any;

    expect(response.statusCode).toBe(200);
    expect(body).toHaveProperty("email");
    expect(body).toHaveProperty("password");
    expect(body.tokens.accessToken).toBe("any_access_token");
    expect(body.tokens.refreshToken).toBe("any_refresh_token");
  });
});
