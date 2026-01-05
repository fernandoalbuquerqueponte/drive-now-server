import express from "express";
import { usersRoutes } from "./routes/user.js";
import { carRoutes } from "./routes/car.js";

export const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/cars", carRoutes);
