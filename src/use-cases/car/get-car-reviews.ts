import { CarNotFoundError } from "../../errors/car.js";
import type {
  IGetCarReviewsRepository,
  IPostgresGetCarByIdRepository,
} from "../../types/car.js";

export class GetCarReviewsUseCase {
  constructor(
    private getCarReviewsRepository: IGetCarReviewsRepository,
    private getCarByIdRepository: IPostgresGetCarByIdRepository,
  ) {
    this.getCarReviewsRepository = getCarReviewsRepository;
    this.getCarByIdRepository = getCarByIdRepository;
  }

  async execute(carId: string) {
    const carExists = await this.getCarByIdRepository.execute(carId);

    if (!carExists) {
      throw new CarNotFoundError();
    }

    const carReviews = await this.getCarReviewsRepository.execute(carId);

    return carReviews;
  }
}
