import { faker } from "@faker-js/faker";
import type { IPostgresGetCarByIdRepository } from "../../../types/car.js";
import { GetCarByIdUseCase } from "../../../use-cases/car/get-car-by-id.js";
import { CarNotFoundError } from "../../../errors/car.js";

describe("GetCarByIdUseCase", () => {
  const carId = faker.string.uuid();
  const car = {
    id: carId,
    brand: "Brand",
    model: "Model",
  } as unknown;

  class GetCarByIdRepositoryStub {
    async execute() {
      return car;
    }
  }

  const makeSut = () => {
    const getCarByIdRepositoryStub =
      new GetCarByIdRepositoryStub() as unknown as IPostgresGetCarByIdRepository;

    const sut = new GetCarByIdUseCase(getCarByIdRepositoryStub);

    return { sut, getCarByIdRepositoryStub };
  };

  it("should return car details when car exists", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(carId);

    expect(result).toEqual(car);
  });

  it("should throw CarNotFoundError when car does not exist", async () => {
    const { sut, getCarByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getCarByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(undefined);

    const promise = sut.execute(carId);

    await expect(promise).rejects.toThrow(new CarNotFoundError());
  });

  it("should call GetCarByIdRepository with correct params", async () => {
    const { sut, getCarByIdRepositoryStub } = makeSut();
    const executeSpy = jest.spyOn(getCarByIdRepositoryStub, "execute");

    await sut.execute(carId);

    expect(executeSpy).toHaveBeenCalledWith(carId);
  });
});
