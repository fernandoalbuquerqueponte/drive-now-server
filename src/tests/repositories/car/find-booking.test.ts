import prismaClient from "../../../../prisma/prisma.js";
import { PostgresFindBooking } from "../../../repositories/postgres/car/find-booking.js";
import { booking, buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("PostgresFindBookingRepository", () => {
  it("should get booking by bookingId from db", async () => {
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
        carId: createdCar.id,
        userId: createdUser.id,
      },
    });

    const sut = new PostgresFindBooking();

    const result = await sut.execute(createdBooking.id);

    expect(result).toBeTruthy();
    expect(result?.carId).toBe(createdBooking.carId);
  });
});
