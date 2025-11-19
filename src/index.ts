import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
} from "./factories/controllers/user.js";
import type { DeleteUserParams } from "./controllers/index.js";

const app = express();

app.use(express.json());

app.post("/api/users", async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController();

  const response = await createUserController.execute(req);

  res.status(response.statusCode).send(response.body);
});

app.get("/api/users/:userId", async (req: Request, res: Response) => {
  const getUserByIdController = makeGetUserByIdController();

  const response = await getUserByIdController.execute(req);

  res.status(response.statusCode).send(response.body);
});

app.delete(
  "/api/users/:userId",
  async (request: Request<DeleteUserParams>, response: Response) => {
    const deleteUserController = makeDeleteUserController();

    const { body, statusCode } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
