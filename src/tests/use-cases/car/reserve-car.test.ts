import { faker } from "@faker-js/faker";
import { booking } from "../../fixtures/car.js";
import { ReserveCarUseCase } from "../../../use-cases/car/reserve-car.js";
import type {
  IPostgresGetCarByIdRepository,
  IPostgresReserveCarRepository,
} from "../../../types/car.js";
import { user } from "../../fixtures/user.js";

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
    async execute() {
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

  it("should call GetCarByIdRepository with correct params", () => {
    const { sut, getCarByIdRepository } = makeSut();

    const getCarByIdSpy = jest.spyOn(getCarByIdRepository, "execute");

    sut.execute(carId, user.id, params);

    expect(getCarByIdSpy).toHaveBeenCalledWith(carId);
    expect(getCarByIdSpy).toHaveBeenCalledTimes(1);
  });
});
