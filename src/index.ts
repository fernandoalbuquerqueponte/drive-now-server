import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import { PostgresCreateUserRepository } from "./repositories/postgres/user/create-user.js";
import { CreateUserController } from "./controllers/user/create-user.js";
import { CreateUserUseCase } from "./use-cases/user/create-user.js";
import { PostgresEmailIsAlreadyInUseUserRepository } from "./repositories/postgres/user/get-user-by-email.js";

const app = express();

app.use(express.json());

app.get("/data", (req: Request, res: Response) => {
  console.log("Rota /data acessada!");
  res.send("Você acessou a rota /data!");
});

app.post("/api/users", async (req: Request, res: Response) => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository =
    new PostgresEmailIsAlreadyInUseUserRepository();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository
  );
  const createUserController = new CreateUserController(createUserUseCase);

  const response = await createUserController.execute(req);

  res.status(response.statusCode).send(response.body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
