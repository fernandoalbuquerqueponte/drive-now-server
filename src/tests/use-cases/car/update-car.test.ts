import { faker } from "@faker-js/faker";
import type {
  IPostgresGetCarByIdRepository,
  IPostgresUpdateCarRepository,
} from "../../../types/car.js";
import { UpdateCarUseCase } from "../../../use-cases/car/update-car.js";
import { car } from "../../fixtures/car.js";

describe("UpdateCarUseCase", () => {
  const carId = faker.string.uuid();
  const userId = faker.string.uuid();

  const carWithUserId = {
    ...car,
    id: carId,
    user_id: userId,
  };

  class UpdateCarRepositoryStub {
    async execute() {
      return carWithUserId;
    }
  }

  class GetCarByIdRepositoryStub {
    async execute() {
      return carWithUserId;
    }
  }

  const makeSut = () => {
    const updateCarRepositoryStub =
      new UpdateCarRepositoryStub() as unknown as IPostgresUpdateCarRepository;
    const getCarByIdRepositoryStub =
      new GetCarByIdRepositoryStub() as unknown as IPostgresGetCarByIdRepository;

    const sut = new UpdateCarUseCase(
      updateCarRepositoryStub,
      getCarByIdRepositoryStub,
    );
    return {
      sut,
      updateCarRepositoryStub,
      getCarByIdRepositoryStub,
    };
  };

  it("should update a car successfully", async () => {
    const { sut } = makeSut();

    const updatedCar = await sut.execute(
      faker.string.uuid(),
      car,
      carWithUserId.user_id,
    );

    expect(updatedCar).toBe(carWithUserId);
  });

  it("should call UpdateUserRepository with correct params", async () => {
    const { sut, updateCarRepositoryStub } = makeSut();

    const updateCarRepositorySpy = jest.spyOn(
      updateCarRepositoryStub,
      "execute",
    );

    await sut.execute(faker.string.uuid(), car, carWithUserId.user_id);

    expect(updateCarRepositorySpy).toHaveBeenCalledWith(
      expect.any(String),
      car,
    );
  });

  it("should call GetCarByIdRepository with correct params", async () => {
    const { sut, getCarByIdRepositoryStub } = makeSut();

    const getCarByIdRepositorySpy = jest.spyOn(
      getCarByIdRepositoryStub,
      "execute",
    );

    await sut.execute(faker.string.uuid(), car, carWithUserId.user_id);

    expect(getCarByIdRepositorySpy).toHaveBeenCalledWith(expect.any(String));
  });
});
