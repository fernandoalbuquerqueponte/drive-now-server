import { Router } from "express";
import { type Request, type Response } from "express";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeLoginUserController,
  makeRefreshTokenController,
  makeUpdateUserController,
} from "../factories/controllers/user.js";
import { auth } from "../middlewares /auth.js";

export const usersRoutes = Router();

usersRoutes.post("/", async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController();

  const response = await createUserController.execute(req);

  res.status(response.statusCode).send(response.body);
});

usersRoutes.get("/", auth, async (req: Request, res: Response) => {
  const getUserByIdController = makeGetUserByIdController();

  const response = await getUserByIdController.execute({ userId: req.userId });

  res.status(response.statusCode).send(response.body);
});

usersRoutes.delete("/", auth, async (request: Request, response: Response) => {
  const deleteUserController = makeDeleteUserController();

  const { body, statusCode } = await deleteUserController.execute({
    userId: request.userId,
  });

  response.status(statusCode).send(body);
});

usersRoutes.patch("/", auth, async (request: Request, response: Response) => {
  const updateUserController = makeUpdateUserController();

  const { body, statusCode } = await updateUserController.execute({
    userId: request.userId,
    body: request.body,
  });

  response.status(statusCode).send(body);
});

usersRoutes.post("/login", async (request: Request, response: Response) => {
  const loginUserController = makeLoginUserController();

  const { body, statusCode } = await loginUserController.execute(request);

  return response.status(statusCode).json(body);
});

usersRoutes.post("/refresh-token", async (request, response) => {
  const refreshTokenController = makeRefreshTokenController();

  const { statusCode, body } = await refreshTokenController.execute(request);

  response.status(statusCode).send(body);
});
