import prismaClient from "../../../../prisma/prisma.js";

export class PostgresGetBookingsCarByUserId {
  async execute(userId: string) {
    return await prismaClient.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        car: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  }
}
