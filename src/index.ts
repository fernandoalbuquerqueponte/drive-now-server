import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import {
  makeCreateUserController,
  makeGetUserByIdController,
} from "./factories/controllers/user.js";

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

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
