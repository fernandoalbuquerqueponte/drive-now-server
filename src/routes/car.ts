import { Router, type Request, type Response } from "express";
import {
  makeCreateCarController,
  makeDeleteCarController,
  makeGetCarByIdController,
  makeGetCarReviewsController,
  makeAddCarReviewController,
  makeGetBookingsByCarIdController,
  makeGetBookingsCarByUserIdController,
  makeGetCarsController,
  makeGetFiltersCarController,
  makeReserveCarController,
  makeUpdateCarController,
} from "../factories/controllers/car.js";
import { auth } from "../middlewares /auth.js";

export const carRoutes = Router();

carRoutes.post("/", auth, async (req: Request, res: Response) => {
  const createCarController = makeCreateCarController();

  const response = await createCarController.execute({
    userId: req.userId,
    body: req.body,
  });

  return res.status(response.statusCode).send(response.body);
});

carRoutes.get("/get-filters", auth, async (req: Request, res: Response) => {
  const getCarsController = makeGetFiltersCarController();

  const { search, category, priceRange, transmission, fuel } = req.query;

  const { body, statusCode } = await getCarsController.execute({
    query: {
      search: search as string,
      category: category as string,
      priceRange: priceRange as string,
      transmission: transmission as string,
      fuel: fuel as string,
    },
  });

  return res.status(statusCode).send(body);
});

carRoutes.get("/:carId/details", auth, async (req: Request, res: Response) => {
  const getCarByIdController = makeGetCarByIdController();

  const { body, statusCode } = await getCarByIdController.execute({
    carId: req.params.carId as string,
  });

  return res.status(statusCode).send(body);
});

carRoutes.get("/:carId/bookings", auth, async (req: Request, res: Response) => {
  const getBookingsByCarIdController = makeGetBookingsByCarIdController();

  const { body, statusCode } = await getBookingsByCarIdController.execute({
    params: {
      carId: req.params.carId as string,
    },
  });

  return res.status(statusCode).send(body);
});

carRoutes.get("/bookings/user", auth, async (req: Request, res: Response) => {
  const getBookingsCarByUserIdController =
    makeGetBookingsCarByUserIdController();

  const { body, statusCode } = await getBookingsCarByUserIdController.execute({
    userId: req.userId,
  });

  return res.status(statusCode).send(body);
});

carRoutes.post("/:carId/reviews", auth, async (req: Request, res: Response) => {
  const addCarReviewController = makeAddCarReviewController();

  const { body, statusCode } = await addCarReviewController.execute({
    userId: req.userId,
    carId: req.params.carId as string,
    body: req.body,
  });

  return res.status(statusCode).send(body);
});

carRoutes.get("/:carId", auth, async (req: Request, res: Response) => {
  const getCarReviewsController = makeGetCarReviewsController();

  const { body, statusCode } = await getCarReviewsController.execute(req);

  return res.status(statusCode).send(body);
});

carRoutes.delete("/:carId", auth, async (req: Request, res: Response) => {
  const deleteCarController = makeDeleteCarController();

  const { body, statusCode } = await deleteCarController.execute(req);

  return res.status(statusCode).send(body);
});

carRoutes.patch("/:carId", auth, async (req: Request, res: Response) => {
  const updateCarController = makeUpdateCarController();

  const { body, statusCode } = await updateCarController.execute({
    carId: req.params.carId as string,
    userId: req.userId,
    body: req.body,
  });

  return res.status(statusCode).send(body);
});

carRoutes.post("/reserve/:carId", auth, async (req: Request, res: Response) => {
  const reserveCarController = makeReserveCarController();

  const { body, statusCode } = await reserveCarController.execute({
    carId: req.params.carId as string,
    userId: req.userId,
    body: req.body,
  });

  return res.status(statusCode).send(body);
});

carRoutes.get("/", auth, async (_req: Request, res: Response) => {
  const getCarsController = makeGetCarsController();

  const { body, statusCode } = await getCarsController.execute();

  return res.status(statusCode).send(body);
});
