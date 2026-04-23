/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { RefreshTokenController } from "../../../controllers/user/refresh-token.js";
import type { RefreshTokenUseCase } from "../../../use-cases/user/refresh-token.js";

describe("RefreshTokenController", () => {
  class RefreshTokenUseCaseStub {
    async execute() {
      return {
        accessToken: faker.string.uuid(),
        refreshToken: faker.string.uuid(),
      };
    }
  }

  const makeSut = () => {
    const refreshTokenUseCaseStub =
      new RefreshTokenUseCaseStub() as unknown as RefreshTokenUseCase;

    const sut = new RefreshTokenController(refreshTokenUseCaseStub);
    return { sut, refreshTokenUseCaseStub };
  };

  const httpRequest = {
    body: {
      refreshToken: faker.string.uuid(),
    },
  };

  it("should return 200 and refresh tokens on successful refresh", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest as any);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });

  it("should return 400 if refresh token is missing", async () => {
    const { sut } = makeSut();

    const invalidHttpRequest = {
      body: {},
    };

    const response = await sut.execute(invalidHttpRequest as any);

    expect(response.statusCode).toBe(400);
  });

  it("should return 500 if an error occurs while refreshing the token", async () => {
    const { sut, refreshTokenUseCaseStub } = makeSut();

    jest
      .spyOn(refreshTokenUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error());

    const response = await sut.execute(httpRequest as any);

    expect(response.statusCode).toBe(500);
  });
});
