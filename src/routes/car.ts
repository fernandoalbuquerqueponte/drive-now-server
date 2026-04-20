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

carRoutes.post("/:userId", auth, async (req: Request, res: Response) => {
  const createCarController = makeCreateCarController();

  const response = await createCarController.execute(req);

  return res.status(response.statusCode).send(response);
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

carRoutes.patch(
  "/:carId/:userId",
  auth,
  async (req: Request, res: Response) => {
    const updateCarController = makeUpdateCarController();

    const { body, statusCode } = await updateCarController.execute(req);

    return res.status(statusCode).send(body);
  },
);

carRoutes.post(
  "/reserve/:carId/:userId",
  auth,
  async (req: Request, res: Response) => {
    const reserveCarController = makeReserveCarController();

    const { body, statusCode } = await reserveCarController.execute(req);

    return res.status(statusCode).send(body);
  },
);
