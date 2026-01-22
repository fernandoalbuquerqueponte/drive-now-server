import type { Booking } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import type {
  CreateBookingDTO,
  IPostgresReserveCarRepository,
} from "../../../types/car.js";

export class PostgresReserveCarRepository implements IPostgresReserveCarRepository {
  async execute(data: CreateBookingDTO): Promise<Booking> {
    const booking = await prismaClient.booking.create({
      data: {
        ...data,
      },
    });

    return booking;
  }
}
