import type { Car, Prisma, Review } from "@prisma/client";
import type { CreateCarSchema } from "../schemas/car.js";

export interface ICreateCarRepository {
  execute(params: CreateCarSchema): Promise<Car | undefined>;
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
  execute(carId: string, params: Prisma.CarUpdateInput): Promise<Car>;
}
