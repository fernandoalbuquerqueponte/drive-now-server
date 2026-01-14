import type { IPostgresDeleteCarRepository } from "../../types/car.js";

export class DeleteCarUseCase {
  constructor(private deleteCarRepository: IPostgresDeleteCarRepository) {
    this.deleteCarRepository = deleteCarRepository;
  }
  async execute(carId: string) {
    const deletedCar = await this.deleteCarRepository.execute(carId);

    return deletedCar;
  }
}
