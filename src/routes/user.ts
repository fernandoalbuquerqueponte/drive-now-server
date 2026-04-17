import { Router } from "express";
import { type Request, type Response } from "express";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeLoginUserController,
  makeUpdateUserController,
} from "../factories/controllers/user.js";
import type { DeleteUserParams } from "../controllers/index.js";

export const usersRoutes = Router();

usersRoutes.post("/", async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController();

  const response = await createUserController.execute(req);

  res.status(response.statusCode).send(response.body);
});

usersRoutes.get("/:userId", async (req: Request, res: Response) => {
  const getUserByIdController = makeGetUserByIdController();

  const response = await getUserByIdController.execute(req);

  res.status(response.statusCode).send(response.body);
});

usersRoutes.delete(
  "/:userId",
  async (request: Request<DeleteUserParams>, response: Response) => {
    const deleteUserController = makeDeleteUserController();

    const { body, statusCode } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
  },
);

usersRoutes.patch("/:userId", async (request: Request, response: Response) => {
  const updateUserController = makeUpdateUserController();

  const { body, statusCode } = await updateUserController.execute(request);

  response.status(statusCode).send(body);
});

usersRoutes.post("/login", async (request: Request, response: Response) => {
  const loginUserController = makeLoginUserController();

  const { body, statusCode } = await loginUserController.execute(request);

  return response.status(statusCode).json(body);
});
