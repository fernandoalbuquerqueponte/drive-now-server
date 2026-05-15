/* eslint-disable @typescript-eslint/no-unused-vars */
import prismaClient from "../../../../prisma/prisma.js";
import type { IGetUserByIdRepository } from "../../../types/user.js";

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        bookings: { include: { car: true } },
        reviews: { include: { car: true } },
        cars: { include: { bookings: true, specifications: true } },
      },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
