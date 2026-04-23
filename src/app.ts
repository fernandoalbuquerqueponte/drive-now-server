/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { usersRoutes } from "./routes/user.js";
import { carRoutes } from "./routes/car.js";
import { apiReference } from "@scalar/express-api-reference";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };

export const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/cars", carRoutes);

app.use(
  "/docs",
  apiReference({
    spec: {
      content: swaggerDocument,
    },
    theme: "purple",
    layout: "modern",
  } as any),
);
