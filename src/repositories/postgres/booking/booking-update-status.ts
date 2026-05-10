import type { BookingStatus } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";

export class PostgresBookingUpdateStatusRepository {
  async execute(id: string, status: BookingStatus) {
    return await prismaClient.booking.update({
      where: { id },
      data: { status },
    });
  }
}
