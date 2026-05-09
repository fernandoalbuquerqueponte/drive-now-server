import prismaClient from "../../../../prisma/prisma.js";
import { PostgresGetBookingsCarByUserId } from "../../../repositories/postgres/car/get-bookings-car-by-user-id.js";
import { user } from "../../fixtures/user.js";

describe("PostgresGetBookingsByUserIdRepository", () => {
  it("should get bookings by user id from db", async () => {
    const createdUser = await prismaClient.user.create({ data: user });

    const sut = new PostgresGetBookingsCarByUserId();

    const result = await sut.execute(createdUser.id);

    expect(result).toBeTruthy();
  });

  it("should call prisma with correct params", async () => {
    const createdUser = await prismaClient.user.create({ data: user });

    const sut = new PostgresGetBookingsCarByUserId();

    const prismaSpy = jest.spyOn(prismaClient.booking, "findMany");

    await sut.execute(createdUser.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        userId: createdUser.id,
      },
      include: {
        car: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  });
});
