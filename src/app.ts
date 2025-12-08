import express from "express";
import { usersRoutes } from "./routes/user.js";

export const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);
