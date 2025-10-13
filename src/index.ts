import "dotenv/config.js";
import express, { type Request, type Response } from "express";

const app = express();

app.use(express.json());

app.get("/data", (req: Request, res: Response) => {
  console.log("Rota /data acessada!");
  res.send("Você acessou a rota /data!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
