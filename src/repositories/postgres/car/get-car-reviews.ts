import prismaClient from "../../../../prisma/prisma.js";
import type { IGetCarReviewsRepository } from "../../../types/car.js";

export class GetCarReviewsRepository implements IGetCarReviewsRepository {
  async execute(carId: string) {
    const carsReviews = await prismaClient.review.findMany({
      where: {
        carId: carId,
      },
      include: {
        user: true,
      },
    });

    return carsReviews;
  }
}
