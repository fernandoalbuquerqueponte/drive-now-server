import type { Review } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import type {
  CreateReviewDTO,
  IAddCarReviewRepository,
} from "../../../types/car.js";

export class PostgresAddCarReviewRepository implements IAddCarReviewRepository {
  async execute(data: CreateReviewDTO): Promise<Review> {
    const review = await prismaClient.review.create({
      data,
    });

    return review;
  }
}
