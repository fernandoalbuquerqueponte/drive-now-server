export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found.");
    this.name = "UserNotFoundError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You do not have permission to perform this action.");
    this.name = "ForbiddenError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}
