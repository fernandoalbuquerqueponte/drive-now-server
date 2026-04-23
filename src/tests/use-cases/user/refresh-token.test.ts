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
      return { userId: "userId" };
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
});
