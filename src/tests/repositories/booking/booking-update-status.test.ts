import { BookingStatus } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import { PostgresBookingUpdateStatusRepository } from "../../../repositories/postgres/booking/booking-update-status.js";
import { booking, buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("PostgresBookingUpdateStatusRepository", () => {
  it("should update booking status successfully", async () => {
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

    const sut = new PostgresBookingUpdateStatusRepository();

    const result = await sut.execute(
      createdBooking.id,
      BookingStatus.CONFIRMED,
    );

    expect(result.status).toBe(BookingStatus.CONFIRMED);
    expect(result.id).toBe(createdBooking.id);
    expect(result.userId).toBe(createdUser.id);
    expect(result.carId).toBe(createdCar.id);
  });

  it("should call prisma with correct params", async () => {
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

    const sut = new PostgresBookingUpdateStatusRepository();
    const executeSpy = jest.spyOn(prismaClient.booking, "update");

    await sut.execute(createdBooking.id, BookingStatus.CONFIRMED);

    expect(executeSpy).toHaveBeenCalledWith({
      where: {
        id: createdBooking.id,
      },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });
  });
});
