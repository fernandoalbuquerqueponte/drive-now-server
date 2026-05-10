import prismaClient from "../../../../prisma/prisma.js";

export class PostgresFindBooking {
  async execute(bookingId: string) {
    return await prismaClient.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        car: true,
      },
    });
  }
}
