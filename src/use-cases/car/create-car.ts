import type { PostgresCreateCarRepository } from "../../repositories/postgres/car/create-car.js";
import type { CreateCarSchema } from "../../schemas/car.js";

export class CreateCarUseCase {
  constructor(private createCarRepository: PostgresCreateCarRepository) {
    this.createCarRepository = createCarRepository;
  }
  async execute(params: CreateCarSchema) {
    const createdCar = await this.createCarRepository.execute(params);

    return createdCar;
  }
}
