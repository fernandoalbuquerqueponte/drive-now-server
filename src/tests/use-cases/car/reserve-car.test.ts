import { faker } from "@faker-js/faker";
import { booking } from "../../fixtures/car.js";
import { ReserveCarUseCase } from "../../../use-cases/car/reserve-car.js";
import type {
  IPostgresGetCarByIdRepository,
  IPostgresReserveCarRepository,
} from "../../../types/car.js";
import { user } from "../../fixtures/user.js";
import { CarNotFoundError } from "../../../errors/car.js";

describe("ReserveCarUseCase", () => {
  const carId = faker.string.uuid();
  const startDate = faker.date.soon();
  const endDate = faker.date.future();

  const params = { startDate, endDate };

  class ReserveCarRepositoryStub {
    async execute() {
      return {
        ...booking,
        carId: carId,
        userId: user.id,
      };
    }
  }

  class GetCarByIdRepositoryStub {
    async execute(): Promise<string | undefined> {
      return carId;
    }
  }

  const makeSut = () => {
    const reserveCarRepository =
      new ReserveCarRepositoryStub() as unknown as IPostgresReserveCarRepository;

    const getCarByIdRepository =
      new GetCarByIdRepositoryStub() as unknown as IPostgresGetCarByIdRepository;

    const sut = new ReserveCarUseCase(
      reserveCarRepository,
      getCarByIdRepository,
    );

    return { reserveCarRepository, getCarByIdRepository, sut };
  };

  it("should booking a car successfully", async () => {
    const { sut } = makeSut();

    const bookingCar = await sut.execute(carId, user.id, params);

    expect(bookingCar).toBeTruthy();
    expect(bookingCar).toHaveProperty("id");
    expect(bookingCar.carId).toBe(carId);
  });

  it("should call GetCarByIdRepository with correct params", async () => {
    const { sut, getCarByIdRepository } = makeSut();

    const getCarByIdSpy = jest.spyOn(getCarByIdRepository, "execute");

    await sut.execute(carId, user.id, params);

    expect(getCarByIdSpy).toHaveBeenCalledWith(carId);
    expect(getCarByIdSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if car is not found", async () => {
    const { sut, getCarByIdRepository } = makeSut();

    jest
      .spyOn(getCarByIdRepository, "execute")
      .mockResolvedValueOnce(undefined);

    const promise = sut.execute(carId, user.id, params);

    await expect(promise).rejects.toThrow(new CarNotFoundError());
  });
});
