import { Router, type Request, type Response } from "express";
import {
  makeCreateCarController,
  makeDeleteCarController,
  makeGetCarReviewsController,
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
