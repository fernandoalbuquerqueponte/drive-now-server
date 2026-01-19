import type { Prisma } from "@prisma/client";
import type {
  IPostgresGetCarByIdRepository,
  IPostgresUpdateCarRepository,
} from "../../types/car.js";
import { ForbiddenError } from "../../errors/user.js";

export class UpdateCarUseCase {
  constructor(
    private updateCarRepository: IPostgresUpdateCarRepository,
    private getCarByIdRepository: IPostgresGetCarByIdRepository,
  ) {
    this.updateCarRepository = updateCarRepository;
    this.getCarByIdRepository = getCarByIdRepository;
  }
  async execute(carId: string, data: Prisma.CarUpdateInput, userId: string) {
    const car = await this.getCarByIdRepository.execute(carId);

    if (car?.user_id !== userId) {
      throw new ForbiddenError();
    }

    const updatedCar = await this.updateCarRepository.execute(carId, data);
    return updatedCar;
  }
}
