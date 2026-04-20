import jwt from "jsonwebtoken";

export class TokenVerifierAdapter {
  execute(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}
