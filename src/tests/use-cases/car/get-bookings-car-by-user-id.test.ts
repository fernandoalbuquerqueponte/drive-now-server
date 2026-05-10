import type { Booking } from "@prisma/client";
import { booking } from "../../fixtures/car.js";
import { faker } from "@faker-js/faker";
import { GetBookingsCarByUserIdUseCase } from "../../../use-cases/car/get-bookings-car-by-user-id.js";
import type { PostgresGetBookingsCarByUserId } from "../../../repositories/postgres/car/get-bookings-car-by-user-id.js";

describe("GetBookingsCarByUserIdUseCase", () => {
  const userId = faker.string.uuid();

  class GetBookingsCarByUserIdRepositoryStub {
    async execute(): Promise<Booking[]> {
      return [
        {
          ...booking,
          userId: userId,
        },
      ] as Booking[];
    }
  }

  const makeSut = () => {
    const getBookingsCarByUserId =
      new GetBookingsCarByUserIdRepositoryStub() as unknown as PostgresGetBookingsCarByUserId;
    const sut = new GetBookingsCarByUserIdUseCase(getBookingsCarByUserId);

    return {
      sut,
      getBookingsCarByUserId,
    };
  };

  it("should get bookings by user id successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(userId);

    expect(result).toEqual([
      {
        ...booking,
        userId: userId,
      },
    ]);
  });

  it("should call GetBookingsCarByUserIdRepository with correct params", async () => {
    const { sut, getBookingsCarByUserId } = makeSut();
    const executeSpy = jest.spyOn(getBookingsCarByUserId, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
