import { Router, type Request, type Response } from "express";
import { makeCreateCarController } from "../factories/controllers/car.js";

export const carRoutes = Router();

carRoutes.post("/", async (req: Request, res: Response) => {
  const createCarController = makeCreateCarController();

  const response = await createCarController.execute(req);

  return res.status(response.statusCode).send(response);
});
