import type { Car } from "@prisma/client";
import type { ICreateCarRepository } from "../../../types/car.js";
import { car } from "../../fixtures/car.js";
import { faker } from "@faker-js/faker";
import { CreateCarUseCase } from "../../../use-cases/car/create-car.js";
import type { CreateCarSchema } from "../../../schemas/car.js";

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

  const makeSut = () => {
    const createCarRepositoryStub = new CreateCarRepositoryStub();

    const sut = new CreateCarUseCase(createCarRepositoryStub);

    return {
      sut,
      createCarRepositoryStub,
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
});
