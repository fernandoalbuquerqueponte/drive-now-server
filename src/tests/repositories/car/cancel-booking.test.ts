import prismaClient from "../../../../prisma/prisma.js";
import { PostgresCancelBookingRepository } from "../../../repositories/postgres/car/cancel-booking.js";
import { booking, buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("PostgresCancelBookingRepository", () => {
  it("should cancel booking successfully", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });

    const createdBooking = await prismaClient.booking.create({
      data: {
        ...booking,
        userId: createdUser.id,
        carId: createdCar.id,
      },
    });

    const sut = new PostgresCancelBookingRepository();

    const result = await sut.execute(createdBooking.id);

    expect(result).toBeTruthy();
  });
});
