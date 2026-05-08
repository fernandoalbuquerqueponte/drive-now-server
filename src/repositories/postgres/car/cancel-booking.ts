import prismaClient from "../../../../prisma/prisma.js";

export class PostgresCancelBookingRepository {
  async execute(bookingId: string) {
    return await prismaClient.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
      },
    });
  }
}
