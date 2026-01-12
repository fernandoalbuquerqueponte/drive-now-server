import { CreateCarController } from "../../controllers/car/create-car.js";
import { GetCarReviewsController } from "../../controllers/car/get-car-reviews.js";
import { PostgresCreateCarRepository } from "../../repositories/postgres/car/create-car.js";
import { GetCarReviewsRepository } from "../../repositories/postgres/car/get-car-reviews.js";
import { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { GetCarReviewsUseCase } from "../../use-cases/car/get-car-reviews.js";

export const makeCreateCarController = () => {
  const createCarRepository = new PostgresCreateCarRepository();
  const createCarUseCase = new CreateCarUseCase(createCarRepository);
  const createCarController = new CreateCarController(createCarUseCase);

  return createCarController;
};

export const makeGetCarReviewsController = () => {
  const getCarReviewsRepository = new GetCarReviewsRepository();
  const getCarReviewsUseCase = new GetCarReviewsUseCase(
    getCarReviewsRepository
  );
  const getCarReviewsController = new GetCarReviewsController(
    getCarReviewsUseCase
  );

  return getCarReviewsController;
};
