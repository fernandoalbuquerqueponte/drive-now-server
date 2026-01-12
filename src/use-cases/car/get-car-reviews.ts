import type { IGetCarReviewsRepository } from "../../types/car.js";

export class GetCarReviewsUseCase {
  constructor(private getCarReviewsRepository: IGetCarReviewsRepository) {
    this.getCarReviewsRepository = getCarReviewsRepository;
  }

  async execute(carId: string) {
    const carReviews = await this.getCarReviewsRepository.execute(carId);

    return carReviews;
  }
}
