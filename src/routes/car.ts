import { Router, type Request, type Response } from "express";
import {
  makeCreateCarController,
  makeDeleteCarController,
  makeGetCarReviewsController,
} from "../factories/controllers/car.js";

export const carRoutes = Router();

carRoutes.post("/", async (req: Request, res: Response) => {
  const createCarController = makeCreateCarController();

  const response = await createCarController.execute(req);

  return res.status(response.statusCode).send(response);
});

carRoutes.get("/:carId", async (req: Request, res: Response) => {
  const getCarReviewsController = makeGetCarReviewsController();

  const { body, statusCode } = await getCarReviewsController.execute(req);

  return res.status(statusCode).send(body);
});

carRoutes.delete("/:carId", async (req: Request, res: Response) => {
  const deleteCarController = makeDeleteCarController();

  const { body, statusCode } = await deleteCarController.execute(req);

  return res.status(statusCode).send(body);
});
