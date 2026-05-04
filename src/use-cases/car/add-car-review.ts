import type { Review } from "@prisma/client";
import { CarNotFoundError } from "../../errors/car.js";
import type {
  CreateReviewDTO,
  IAddCarReviewRepository,
  IPostgresGetCarByIdRepository,
} from "../../types/car.js";

export class AddCarReviewUseCase {
  constructor(
    private addCarReviewRepository: IAddCarReviewRepository,
    private getCarByIdRepository: IPostgresGetCarByIdRepository,
  ) {
    this.addCarReviewRepository = addCarReviewRepository;
    this.getCarByIdRepository = getCarByIdRepository;
  }

  async execute(
    carId: string,
    userId: string,
    params: CreateReviewDTO,
  ): Promise<Review> {
    const car = await this.getCarByIdRepository.execute(carId);

    if (!car) {
      throw new CarNotFoundError();
    }

    if (params.rating < 1 || params.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const review = await this.addCarReviewRepository.execute({
      carId,
      userId,
      rating: params.rating,
      comment: params.comment,
    });

    return review;
  }
}
