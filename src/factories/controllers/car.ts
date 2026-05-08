import { CreateCarController } from "../../controllers/car/create-car.js";
import { DeleteCarController } from "../../controllers/car/delete-car.js";
import { AddCarReviewController } from "../../controllers/car/add-car-review.js";
import { GetCarReviewsController } from "../../controllers/car/get-car-reviews.js";
import { GetBookingsByCarIdController } from "../../controllers/car/get-bookings-by-car-id.js";
import { GetBookingsCarByUserIdController } from "../../controllers/car/get-bookings-car-by-user-id.js";
import { GetCarByIdController } from "../../controllers/car/get-car-by-id.js";
import { ReserveCarController } from "../../controllers/car/reserve-car.js";
import { UpdateCarController } from "../../controllers/car/update-car.js";
import { PostgresCreateCarRepository } from "../../repositories/postgres/car/create-car.js";
import { PostgresDeleteCarRepository } from "../../repositories/postgres/car/delete-car.js";
import { PostgresGetCarByIdRepository } from "../../repositories/postgres/car/get-car-by-id.js";
import { GetCarReviewsRepository } from "../../repositories/postgres/car/get-car-reviews.js";
import { PostgresGetBookingsByCarIdRepository } from "../../repositories/postgres/car/get-bookings-by-car-id.js";
import { PostgresGetBookingsCarByUserId } from "../../repositories/postgres/car/get-bookings-car-by-user-id.js";
import { PostgresAddCarReviewRepository } from "../../repositories/postgres/car/add-car-review.js";
import { PostgresReserveCarRepository } from "../../repositories/postgres/car/reserve-car.js";
import { PostgresUpdateCarRepository } from "../../repositories/postgres/car/update-car.js";
import { PostgresGetUserByIdRepository } from "../../repositories/postgres/index.js";
import { GetCarRepository } from "../../repositories/postgres/car/get-cars.js";
import { CreateCarUseCase } from "../../use-cases/car/create-car.js";
import { DeleteCarUseCase } from "../../use-cases/car/delete-car.js";
import { GetCarReviewsUseCase } from "../../use-cases/car/get-car-reviews.js";
import { AddCarReviewUseCase } from "../../use-cases/car/add-car-review.js";
import { GetBookingsByCarIdUseCase } from "../../use-cases/car/get-bookings-by-car-id.js";
import { GetBookingsCarByUserIdUseCase } from "../../use-cases/car/get-bookings-car-by-user-id.js";
import { GetCarByIdUseCase } from "../../use-cases/car/get-car-by-id.js";
import { GetCarsUseCase } from "../../use-cases/car/get-cars.js";
import { ReserveCarUseCase } from "../../use-cases/car/reserve-car.js";
import { UpdateCarUseCase } from "../../use-cases/car/update-car.js";
import { GetCarsController } from "../../controllers/car/get-cars.js";
import { GetFilterCarController } from "../../controllers/car/get-filter-car.js";
import { GetFilterCarUseCase } from "../../use-cases/car/get-filter-car.js";
import { PostgresGetFilterCars } from "../../repositories/postgres/car/get-filter-car.js";
import { CancelBookingController } from "../../controllers/car/cancel-booking.js";
import { CancelBookingUseCase } from "../../use-cases/car/cancel-booking.js";
import { PostgresCancelBookingRepository } from "../../repositories/postgres/car/cancel-booking.js";
import { PostgresFindBooking } from "../../repositories/postgres/car/find-booking.js";

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

export const makeAddCarReviewController = () => {
  const addCarReviewRepository = new PostgresAddCarReviewRepository();
  const getCarByIdRepository = new PostgresGetCarByIdRepository();

  const addCarReviewUseCase = new AddCarReviewUseCase(
    addCarReviewRepository,
    getCarByIdRepository,
  );

  const addCarReviewController = new AddCarReviewController(
    addCarReviewUseCase,
  );

  return addCarReviewController;
};

export const makeGetBookingsByCarIdController = () => {
  const getBookingsByCarIdRepository =
    new PostgresGetBookingsByCarIdRepository();
  const getBookingsByCarIdUseCase = new GetBookingsByCarIdUseCase(
    getBookingsByCarIdRepository,
  );
  const getBookingsByCarIdController = new GetBookingsByCarIdController(
    getBookingsByCarIdUseCase,
  );

  return getBookingsByCarIdController;
};

export const makeGetBookingsCarByUserIdController = () => {
  const getBookingsCarByUserIdRepository = new PostgresGetBookingsCarByUserId();
  const getBookingsCarByUserIdUseCase = new GetBookingsCarByUserIdUseCase(
    getBookingsCarByUserIdRepository,
  );
  const getBookingsCarByUserIdController = new GetBookingsCarByUserIdController(
    getBookingsCarByUserIdUseCase,
  );

  return getBookingsCarByUserIdController;
};

export const makeGetCarByIdController = () => {
  const getCarByIdRepository = new PostgresGetCarByIdRepository();
  const getCarByIdUseCase = new GetCarByIdUseCase(getCarByIdRepository);
  const getCarByIdController = new GetCarByIdController(getCarByIdUseCase);

  return getCarByIdController;
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

export const makeGetFiltersCarController = () => {
  const getFilterCarRepository = new PostgresGetFilterCars();

  const getFilterCarUseCase = new GetFilterCarUseCase(getFilterCarRepository);

  const getFilterCarController = new GetFilterCarController(
    getFilterCarUseCase,
  );

  return getFilterCarController;
};

export const makeCancelBookingController = () => {
  const findBookingRepository = new PostgresFindBooking();
  const cancelBookingRepository = new PostgresCancelBookingRepository();
  const cancelBookingUseCase = new CancelBookingUseCase(
    cancelBookingRepository,
    findBookingRepository,
  );

  const cancelBookingController = new CancelBookingController(
    cancelBookingUseCase,
  );

  return cancelBookingController;
};
