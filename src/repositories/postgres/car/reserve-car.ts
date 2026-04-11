import type { Booking } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import type {
  CreateBookingDTO,
  IPostgresReserveCarRepository,
} from "../../../types/car.js";

export class PostgresReserveCarRepository implements IPostgresReserveCarRepository {
  async execute(data: CreateBookingDTO): Promise<Booking> {
    const hasConflictingBooking = await prismaClient.booking.findFirst({
      where: {
        carId: data.carId,
        startDate: {
          lte: data.endDate,
        },
        endDate: {
          gte: data.startDate,
        },
      },
    });

    if (hasConflictingBooking) {
      throw new Error("Car is already reserved for the selected period");
    }

    const booking = await prismaClient.booking.create({
      data: {
        ...data,
      },
    });

    return booking;
  }
}
