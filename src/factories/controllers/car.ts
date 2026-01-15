import { CreateCarController } from "../../controllers/car/create-car.js";
import { DeleteCarController } from "../../controllers/car/delete-car.js";
import { GetCarReviewsController } from "../../controllers/car/get-car-reviews.js";
import { PostgresCreateCarRepository } from "../../repositories/postgres/car/create-car.js";
import { PostgresDeleteCarRepository } from "../../repositories/postgres/car/delete-car.js";
import { PostgresGetCarByIdRepository } from "../../repositories/postgres/car/get-car-by-id.js";
import { GetCarReviewsRepository } from "../../repositories/postgres/car/get-car-reviews.js";
import { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { DeleteCarUseCase } from "../../use-cases/car/delete-car.js";
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

export const makeDeleteCarController = () => {
  const deleteCarRepository = new PostgresDeleteCarRepository();
  const getCarByIdRepository = new PostgresGetCarByIdRepository();
  const deleteCarUseCase = new DeleteCarUseCase(
    deleteCarRepository,
    getCarByIdRepository
  );
  const deleteCarController = new DeleteCarController(deleteCarUseCase);

  return deleteCarController;
};
