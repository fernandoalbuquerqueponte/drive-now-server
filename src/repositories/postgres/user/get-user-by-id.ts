import prismaClient from "../../../../prisma/prisma.js";
import type { IGetUserByIdRepository } from "../../../types/user.js";

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const response = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        bookings: true,
        reviews: true,
        cars: {
          select: {
            id: true,
            brand: true,
            model: true,
            category: true,
            year: true,
            pricePerHour: true,
            available: true,
            image: true,
            bookings: true,
          },
        },
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        imageUrl: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!response) {
      return null;
    }

    return response;
  }
}
