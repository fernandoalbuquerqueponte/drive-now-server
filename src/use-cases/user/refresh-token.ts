import type { TokenVerifierAdapter } from "../../adapters/token-verifier.js";
import type { TokensGeneratorAdapter } from "../../adapters/tokens-generator.js";
import { ForbiddenError } from "../../errors/user.js";

interface UserPayload {
  userId: string;
}

export class RefreshTokenUseCase {
  constructor(
    private tokensRegeneratorAdapter: TokensGeneratorAdapter,
    private tokenVerifierAdapter: TokenVerifierAdapter,
  ) {
    this.tokensRegeneratorAdapter = tokensRegeneratorAdapter;
    this.tokenVerifierAdapter = tokenVerifierAdapter;
  }

  async execute(refreshToken: string) {
    try {
      const decodedToken = this.tokenVerifierAdapter.execute(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
      ) as UserPayload;

      if (!decodedToken) {
        throw new ForbiddenError();
      }

      return this.tokensRegeneratorAdapter.execute(decodedToken.userId);
    } catch (error) {
      console.error(error);
      throw new ForbiddenError();
    }
  }
}
