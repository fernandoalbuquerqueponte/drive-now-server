import type { Booking, Car } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import type { IPostgresReserveCarRepository } from "../../../types/car.js";

export class PostgresReserveCarRepository implements IPostgresReserveCarRepository {
  async execute(
    params: Booking,
    car: Car,
    hours: number,
    carId: string,
    userId: string,
  ): Promise<Booking> {
    const booking = await prismaClient.booking.create({
      data: {
        ...params,
        carId: carId,
        userId: userId,
        status: "PENDING",
        totalPrice: car.pricePerHour * (hours / (1000 * 60 * 60)),
      },
    });

    return booking;
  }
}
