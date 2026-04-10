import type { Car } from "@prisma/client";
import type { ICreateCarRepository } from "../../../types/car.js";
import { car } from "../../fixtures/car.js";
import { faker } from "@faker-js/faker";
import { CreateCarUseCase } from "../../../use-cases/car/create-car.js";
import type { CreateCarSchema } from "../../../schemas/car.js";
import { user } from "../../fixtures/user.js";
import type { IGetUserByIdRepository } from "../../../types/user.js";
import { UserNotFoundError } from "../../../errors/user.js";

describe("CreateCarUseCase", () => {
  const userId = faker.string.uuid();
  const carId = faker.string.uuid();

  class CreateCarRepositoryStub implements ICreateCarRepository {
    async execute(_params: CreateCarSchema, userId: string): Promise<Car> {
      return {
        ...car,
        id: carId,
        user_id: userId,
      } as Car;
    }
  }

  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const createCarRepositoryStub =
      new CreateCarRepositoryStub() as unknown as ICreateCarRepository;
    const getUserByIdRepositoryStub =
      new GetUserByIdRepositoryStub() as unknown as IGetUserByIdRepository;

    const sut = new CreateCarUseCase(
      createCarRepositoryStub,
      getUserByIdRepositoryStub,
    );

    return {
      sut,
      createCarRepositoryStub,
      getUserByIdRepositoryStub,
    };
  };

  it("should create a new car", async () => {
    const { sut } = makeSut();

    const createdCar = await sut.execute(car, userId);

    expect(createdCar).toEqual({
      ...car,
      id: carId,
      user_id: userId,
    });
  });

  it("should call CreateCarRepository with correct params", async () => {
    const { sut, createCarRepositoryStub } = makeSut();

    const executeSpy = jest.spyOn(createCarRepositoryStub, "execute");

    await sut.execute(car, userId);

    expect(executeSpy).toHaveBeenCalledWith(car, userId);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();

    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute");

    await sut.execute(car, userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw UserNotFoundError if user is not found", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(null);

    const promise = sut.execute(car, userId);

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it("should throw if CreateCarRepository throws", async () => {
    const { sut, createCarRepositoryStub } = makeSut();
    jest
      .spyOn(createCarRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(car, userId);

    await expect(promise).rejects.toThrow(new Error());
  });
});
