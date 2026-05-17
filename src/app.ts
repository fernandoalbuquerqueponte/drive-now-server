/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { usersRoutes } from "./routes/user.js";
import { carRoutes } from "./routes/car.js";
import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };
import { paymentRoutes } from "./routes/payment.js";
import path from "path";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/users", usersRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/payments", paymentRoutes);

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
