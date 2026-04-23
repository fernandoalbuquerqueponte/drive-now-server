import { LoginUserUseCase } from "../../../use-cases/user/login-user.js";
import { user } from "../../fixtures/user.js";

describe("LoginUserUseCase", () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordComparatorAdapterStub {
    async execute() {
      return true;
    }
  }

  class TokensGeneratorAdapterStub {
    async execute() {
      return {
        accessToken: "any_access_token",
        refreshToken: "any_refresh_token",
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapterStub = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub();

    const sut = new LoginUserUseCase(
      getUserByEmailRepositoryStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    );
    return {
      sut,
      getUserByEmailRepositoryStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    };
  };

  it("should return an acess token and refresh token successfully", () => {
    const { sut } = makeSut();

    const result = sut.execute("any_email", "any_password");

    expect(result).resolves.toEqual({
      ...user,
      tokens: {
        accessToken: "any_access_token",
        refreshToken: "any_refresh_token",
      },
    });
  });
});
