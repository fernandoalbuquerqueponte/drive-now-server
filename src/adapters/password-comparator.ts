import bcrypt from "bcrypt";

export class PasswordComparatorAdapter {
  execute(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
