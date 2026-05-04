import { CarNotFoundError } from "../../errors/car.js";
import type { IPostgresGetCarByIdRepository } from "../../types/car.js";

export class GetCarByIdUseCase {
  constructor(private getCarByIdRepository: IPostgresGetCarByIdRepository) {
    this.getCarByIdRepository = getCarByIdRepository;
  }

  async execute(carId: string) {
    const car = await this.getCarByIdRepository.execute(carId);

    if (!car) {
      throw new CarNotFoundError();
    }

    return car;
  }
}
