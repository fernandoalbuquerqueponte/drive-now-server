import type { UpdateUserSchema } from "../../../schemas/user.js";
import type { UpdateUserUseCase } from "../../../use-cases/index.js";
import { UpdateUserController } from "../../../controllers/index.js";
import { faker } from "@faker-js/faker";
import { UserAlreadyExistsError } from "../../../errors/user.js";

describe("UpdateUserController", () => {
  class UpdateUserUseCaseStub {
    async execute(userId: string, user: UpdateUserSchema) {
      return {
        id: userId,
        ...user,
      };
    }
  }

  const httpRequest = {
    userId: faker.string.uuid(),
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
    },
  };

  const makeSut = () => {
    const updateUserUseCase =
      new UpdateUserUseCaseStub() as unknown as UpdateUserUseCase;

    const sut = new UpdateUserController(updateUserUseCase);

    return {
      sut,
      updateUserUseCase,
    };
  };

  it("should update user successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: httpRequest.userId,
      ...httpRequest.body,
    });
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      userId: "invalid-uuid",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        email: "invalid-email",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if password is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({
          length: 5,
        }),
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if imageUrl is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        imageUrl: "invalid-url",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should call UpdateUserUseCase with correct params", async () => {
    const { sut, updateUserUseCase } = makeSut();

    const executeSpy = jest.spyOn(updateUserUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.userId,
      httpRequest.body,
    );
  });

  it("should return 400 if UserAlreadyExistsError throws", async () => {
    const { sut, updateUserUseCase } = makeSut();
    jest
      .spyOn(updateUserUseCase, "execute")
      .mockRejectedValueOnce(
        new UserAlreadyExistsError(faker.internet.email()),
      );

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 500 if UpdateUserUseCase throws generic error", async () => {
    const { sut, updateUserUseCase } = makeSut();
    jest.spyOn(updateUserUseCase, "execute").mockRejectedValueOnce(new Error());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(500);
  });
});
