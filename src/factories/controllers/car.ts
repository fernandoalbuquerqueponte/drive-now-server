import { CreateCarController } from "../../controllers/car/create-car.js";
import { DeleteCarController } from "../../controllers/car/delete-car.js";
import { GetCarReviewsController } from "../../controllers/car/get-car-reviews.js";
import { ReserveCarController } from "../../controllers/car/reserve-car.js";
import { UpdateCarController } from "../../controllers/car/update-car.js";
import { PostgresCreateCarRepository } from "../../repositories/postgres/car/create-car.js";
import { PostgresDeleteCarRepository } from "../../repositories/postgres/car/delete-car.js";
import { PostgresGetCarByIdRepository } from "../../repositories/postgres/car/get-car-by-id.js";
import { GetCarReviewsRepository } from "../../repositories/postgres/car/get-car-reviews.js";
import { PostgresReserveCarRepository } from "../../repositories/postgres/car/reserve-car.js";
import { PostgresUpdateCarRepository } from "../../repositories/postgres/car/update-car.js";
import { PostgresGetUserByIdRepository } from "../../repositories/postgres/index.js";
import { GetCarRepository } from "../../repositories/postgres/car/get-cars.js";
import { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { DeleteCarUseCase } from "../../use-cases/car/delete-car.js";
import { GetCarReviewsUseCase } from "../../use-cases/car/get-car-reviews.js";
import { GetCarsUseCase } from "../../use-cases/car/get-cars.js";
import { ReserveCarUseCase } from "../../use-cases/car/reserve-car.js";
import { UpdateCarUseCase } from "../../use-cases/car/update-car.js";
import { GetCarsController } from "../../controllers/car/get-cars.js";

export const makeCreateCarController = () => {
  const createCarRepository = new PostgresCreateCarRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const createCarUseCase = new CreateCarUseCase(
    createCarRepository,
    getUserByIdRepository,
  );

  const createCarController = new CreateCarController(createCarUseCase);

  return createCarController;
};

export const makeGetCarReviewsController = () => {
  const getCarReviewsRepository = new GetCarReviewsRepository();
  const getCarByIdRepository = new PostgresGetCarByIdRepository();
  const getCarReviewsUseCase = new GetCarReviewsUseCase(
    getCarReviewsRepository,
    getCarByIdRepository,
  );
  const getCarReviewsController = new GetCarReviewsController(
    getCarReviewsUseCase,
  );

  return getCarReviewsController;
};

export const makeDeleteCarController = () => {
  const deleteCarRepository = new PostgresDeleteCarRepository();
  const getCarByIdRepository = new PostgresGetCarByIdRepository();
  const deleteCarUseCase = new DeleteCarUseCase(
    deleteCarRepository,
    getCarByIdRepository,
  );
  const deleteCarController = new DeleteCarController(deleteCarUseCase);

  return deleteCarController;
};

export const makeUpdateCarController = () => {
  const updateCarRepository = new PostgresUpdateCarRepository();
  const getCarByIdRepository = new PostgresGetCarByIdRepository();
  const updateCarUseCase = new UpdateCarUseCase(
    updateCarRepository,
    getCarByIdRepository,
  );

  const updateCarController = new UpdateCarController(updateCarUseCase);

  return updateCarController;
};

export const makeReserveCarController = () => {
  const reserveCarRespository = new PostgresReserveCarRepository();
  const getCarByIdRepository = new PostgresGetCarByIdRepository();

  const reserveCarUseCase = new ReserveCarUseCase(
    reserveCarRespository,
    getCarByIdRepository,
  );

  const reserveCarController = new ReserveCarController(reserveCarUseCase);

  return reserveCarController;
};

export const makeGetCarsController = () => {
  const getCarsRepository = new GetCarRepository();
  const getCarsUseCase = new GetCarsUseCase(getCarsRepository);

  const getCarsController = new GetCarsController(getCarsUseCase);

  return getCarsController;
};
