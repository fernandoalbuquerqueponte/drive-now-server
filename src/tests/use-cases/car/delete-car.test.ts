import { faker } from "@faker-js/faker";
import type {
  IPostgresDeleteCarRepository,
  IPostgresGetCarByIdRepository,
} from "../../../types/car.js";
import { DeleteCarUseCase } from "../../../use-cases/car/delete-car.js";
import { car } from "../../fixtures/car.js";
import { CarNotFoundError } from "../../../errors/car.js";

describe("DeleteCarUseCase", () => {
  class DeleteCarRepositoryStub {
    async execute() {
      return car;
    }
  }

  class GetCarByIdRepositoryStub {
    async execute() {
      return car;
    }
  }

  const makeSut = () => {
    const deleteCarRepositoryStub =
      new DeleteCarRepositoryStub() as unknown as IPostgresDeleteCarRepository;
    const getCarByIdRepositoryStub =
      new GetCarByIdRepositoryStub() as unknown as IPostgresGetCarByIdRepository;

    const sut = new DeleteCarUseCase(
      deleteCarRepositoryStub,
      getCarByIdRepositoryStub,
    );

    return {
      sut,
      deleteCarRepositoryStub,
      getCarByIdRepositoryStub,
    };
  };

  it("should delete a car successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid());

    expect(result).toEqual(car);
  });

  it("should call GetCarByIdRepository with correct params", async () => {
    const { sut, getCarByIdRepositoryStub } = makeSut();
    const getCarByIdSpy = jest.spyOn(getCarByIdRepositoryStub, "execute");
    const carId = faker.string.uuid();

    await sut.execute(carId);

    expect(getCarByIdSpy).toHaveBeenCalledWith(carId);
  });

  it("should throw an error if car is not found", async () => {
    const { sut, getCarByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getCarByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(undefined);

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow(new CarNotFoundError());
  });
});
