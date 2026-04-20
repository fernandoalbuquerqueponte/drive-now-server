import { Router } from "express";
import { type Request, type Response } from "express";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeLoginUserController,
  makeUpdateUserController,
} from "../factories/controllers/user.js";
import { auth } from "../middlewares /auth.js";

export const usersRoutes = Router();

usersRoutes.post("/", async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController();

  const response = await createUserController.execute(req);

  res.status(response.statusCode).send(response.body);
});

usersRoutes.get("/:userId", auth, async (req: Request, res: Response) => {
  const getUserByIdController = makeGetUserByIdController();

  const response = await getUserByIdController.execute(req);

  res.status(response.statusCode).send(response.body);
});

usersRoutes.delete(
  "/:userId",
  auth,
  async (request: Request, response: Response) => {
    const deleteUserController = makeDeleteUserController();

    const { body, statusCode } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
  },
);

usersRoutes.patch(
  "/:userId",
  auth,
  async (request: Request, response: Response) => {
    const updateUserController = makeUpdateUserController();

    const { body, statusCode } = await updateUserController.execute(request);

    response.status(statusCode).send(body);
  },
);

usersRoutes.post("/login", async (request: Request, response: Response) => {
  const loginUserController = makeLoginUserController();

  const { body, statusCode } = await loginUserController.execute(request);

  return response.status(statusCode).json(body);
});
