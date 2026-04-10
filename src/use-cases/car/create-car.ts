import { UserNotFoundError } from "../../errors/user.js";
import type { CreateCarSchema } from "../../schemas/car.js";
import type { ICreateCarRepository } from "../../types/car.js";
import type { IGetUserByIdRepository } from "../../types/user.js";

export class CreateCarUseCase {
  constructor(
    private createCarRepository: ICreateCarRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.createCarRepository = createCarRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(params: CreateCarSchema, userId: string) {
    const createdCar = await this.createCarRepository.execute(params, userId);

    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return createdCar;
  }
}
