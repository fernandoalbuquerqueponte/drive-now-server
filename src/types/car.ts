import type { Car, Review } from "@prisma/client";
import type { CreateCarSchema } from "../schemas/car.js";

export interface ICreateCarRepository {
  execute(params: CreateCarSchema, userId: string): Promise<Car>;
}

export interface IGetCarReviewsRepository {
  execute(carId: string): Promise<Review[]>;
}

export interface IPostgresDeleteCarRepository {
  execute(carId: string): Promise<Car>;
}

export interface IPostgresGetCarByIdRepository {
  execute(carId: string): Promise<Car | undefined>;
}

export interface IPostgresUpdateCarRepository {
  execute(carId: string, params: CreateCarSchema): Promise<Car>;
}
