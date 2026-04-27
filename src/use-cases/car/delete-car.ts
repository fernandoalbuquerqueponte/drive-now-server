import { CarNotFoundError } from "../../errors/car.js";
import type {
  IPostgresDeleteCarRepository,
  IPostgresGetCarByIdRepository,
} from "../../types/car.js";

export class DeleteCarUseCase {
  constructor(
    private deleteCarRepository: IPostgresDeleteCarRepository,
    private postgresGetCarByIdRepository: IPostgresGetCarByIdRepository,
  ) {
    this.deleteCarRepository = deleteCarRepository;
    this.postgresGetCarByIdRepository = postgresGetCarByIdRepository;
  }
  async execute(carId: string) {
    const existCar = await this.postgresGetCarByIdRepository.execute(carId);

    if (!existCar) {
      throw new CarNotFoundError();
    }

    const deletedCar = await this.deleteCarRepository.execute(carId);

    return deletedCar;
  }
}
