import prismaClient from "../../../../prisma/prisma.js";

export class PostgresGetBookingsByCarIdRepository {
  async execute(carId: string) {
    return await prismaClient.booking.findMany({
      where: {
        carId,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });
  }
}
