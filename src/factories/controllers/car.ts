import { CreateCarController } from "../../controllers/car/create-car.js";
import { PostgresCreateCarRepository } from "../../repositories/postgres/car/create-car.js";
import { CreateCarUseCase } from "../../use-cases/car/create-car.js";

export const makeCreateCarController = () => {
  const createCarRepository = new PostgresCreateCarRepository();
  const createCarUseCase = new CreateCarUseCase(createCarRepository);
  const createCarController = new CreateCarController(createCarUseCase);

  return createCarController;
};
