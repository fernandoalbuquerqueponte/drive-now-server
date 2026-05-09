import type { Review } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import type { IAddCarReviewRepository } from "../../../types/car.js";

export class PostgresAddCarReviewRepository implements IAddCarReviewRepository {
  async execute(data: {
    carId: string;
    userId: string;
    rating: number;
    comment?: string | null;
  }): Promise<Review> {
    const review = await prismaClient.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            imageUrl: true,
            reviews: true,
            cars: true,
          },
        },
      },
    });

    return review;
  }
}
