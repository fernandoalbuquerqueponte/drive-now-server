/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForbiddenError } from "../../../errors/user.js";
import { RefreshTokenUseCase } from "../../../use-cases/user/refresh-token.js";

describe("RefreshTokenUseCase", () => {
  class TokensGeneratorAdapterStub {
    async execute() {
      return {
        accessToken: "newAccessToken",
        refreshToken: "newRefreshToken",
      };
    }
  }

  class TokenVerifierAdapterStub {
    async execute() {
      return true;
    }
  }

  const makeSut = () => {
    const tokensRegeneratorAdapter = new TokensGeneratorAdapterStub();
    const tokenVerifierAdapter = new TokenVerifierAdapterStub();

    const sut = new RefreshTokenUseCase(
      tokensRegeneratorAdapter,
      tokenVerifierAdapter,
    );

    return {
      sut,
      tokensRegeneratorAdapter,
      tokenVerifierAdapter,
    };
  };

  it("should return new tokens when a valid refresh token is provided", async () => {
    const { sut } = makeSut();

    const tokens = await sut.execute("validRefreshToken");

    expect(tokens).toEqual({
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    });
  });

  it("should throw if TokenVerifierAdapter throws", async () => {
    const { sut, tokenVerifierAdapter } = makeSut();
    jest.spyOn(tokenVerifierAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.execute("any_refresh_token")).rejects.toThrow(
      new ForbiddenError(),
    );
  });

  it("should throw ForbiddenError if TokenVerifierAdapter returns null", async () => {
    const { sut, tokenVerifierAdapter } = makeSut();

    jest
      .spyOn(tokenVerifierAdapter, "execute")
      .mockReturnValueOnce(null as any);

    const promise = sut.execute("any_token");

    await expect(promise).rejects.toThrow(new ForbiddenError());
  });

  it("should throw ForbiddenError if TokenVerifierAdapter throws", async () => {
    const { sut, tokenVerifierAdapter } = makeSut();

    jest.spyOn(tokenVerifierAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute("any_refresh_token");

    await expect(promise).rejects.toThrow(new ForbiddenError());
  });
});
