import prismaClient from "../../../../prisma/prisma.js";
import { PostgresGetBookingsByCarIdRepository } from "../../../repositories/postgres/car/get-bookings-by-car-id.js";
import { buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("PostgresGetBookingsByCarIdRepository", () => {
  it("should get bookings by car id from db", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });

    const sut = new PostgresGetBookingsByCarIdRepository();

    const result = await sut.execute(createdCar.id);

    expect(result).toBeTruthy();
  });

  it("should call prisma with correct params", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });

    const sut = new PostgresGetBookingsByCarIdRepository();

    const prismaSpy = jest.spyOn(prismaClient.booking, "findMany");

    await sut.execute(createdCar.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        carId: createdCar.id,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });
  });
});
