import prismaClient from "../../../../prisma/prisma.js";
import { BookingStatus } from "@prisma/client";

export class PostgresBookingRepository {
  async execute(id: string) {
    return await prismaClient.booking.findUnique({
      where: { id },
      include: { car: true },
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    return await prismaClient.booking.update({
      where: { id },
      data: { status },
    });
  }
}
