import type { Request } from "express";
import { faker } from "@faker-js/faker";

import { CreateUserController } from "../../../controllers/index.js";
import { CreateUserUseCase } from "../../../use-cases/index.js";

import type { CreateUserSchema, User } from "../../../schemas/user.js";
import { UserAlreadyExistsError } from "../../../errors/user.js";

describe("Create User Controller", () => {
  class CreateUserUseCaseStub {
    async execute(user: CreateUserSchema): Promise<User> {
      return {
        id: faker.string.uuid(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        imageUrl: user.imageUrl ?? null,
      };
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub() as CreateUserUseCase;
    const sut = new CreateUserController(createUserUseCase);

    return { sut, createUserUseCase };
  };

  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      imageUrl: faker.image.url(),
      password: faker.internet.password({
        length: 10,
      }),
    },
  } as Request<any, any, CreateUserSchema>;

  it("should create user with valid data", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      first_name: httpRequest.body.first_name,
      last_name: httpRequest.body.last_name,
      email: httpRequest.body.email,
      imageUrl: httpRequest.body.imageUrl,
    });
  });

  it("should return 400 if first_name is not provided", async () => {
    const { sut } = makeSut();

    const fakeRequest = {
      body: {
        ...httpRequest.body,
        first_name: undefined,
      },
    } as unknown as Request<any, any, Partial<CreateUserSchema>>;

    const response = await sut.execute(fakeRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if last_name is not provided", async () => {
    const { sut } = makeSut();

    const fakeRequest = {
      body: {
        ...httpRequest.body,
        last_name: undefined,
      },
    } as unknown as Request<any, any, Partial<CreateUserSchema>>;

    const response = await sut.execute(fakeRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if email is not provided", async () => {
    const { sut } = makeSut();

    const fakeRequest = {
      body: {
        ...httpRequest.body,
        email: undefined,
      },
    } as unknown as Request<any, any, Partial<CreateUserSchema>>;

    const response = await sut.execute(fakeRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    const { sut } = makeSut();

    const fakeRequest = {
      body: {
        ...httpRequest.body,
        password: undefined,
      },
    } as unknown as Request<any, any, Partial<CreateUserSchema>>;

    const response = await sut.execute(fakeRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if password is invalid", async () => {
    const { sut } = makeSut();

    const fakeRequest = {
      body: {
        ...httpRequest.body,
        password: faker.internet.password({
          length: 5,
        }),
      },
    } as unknown as Request<any, any, Partial<CreateUserSchema>>;

    const response = await sut.execute(fakeRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    const { sut } = makeSut();

    const fakeRequest = {
      body: {
        ...httpRequest.body,
        email: "invalid_email",
      },
    } as unknown as Request<any, any, Partial<CreateUserSchema>>;

    const response = await sut.execute(fakeRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should call CreateUserUseCase with correct params", async () => {
    const { sut, createUserUseCase } = makeSut();

    const executeSpy = jest.spyOn(createUserUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it("should return 500 if CreateUserUseCase throws", async () => {
    const { sut, createUserUseCase } = makeSut();
    jest.spyOn(createUserUseCase, "execute").mockRejectedValueOnce(new Error());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(500);
  });

  it("should return 400 if CreateUserUseCase throws UserAlreadyExistsError", async () => {
    const { sut, createUserUseCase } = makeSut();
    jest
      .spyOn(createUserUseCase, "execute")
      .mockRejectedValueOnce(
        new UserAlreadyExistsError(faker.internet.email())
      );

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(400);
  });
});
