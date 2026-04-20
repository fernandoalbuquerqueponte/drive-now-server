import type { Booking, BookingStatus, Car, Review } from "@prisma/client";
import type { CreateCarSchema, UpdateCarSchema } from "../schemas/car.js";

export interface CreateBookingDTO {
  carId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  totalPrice: number;
  status: BookingStatus;
}

export interface ReserveCarInputDTO {
  startDate: Date;
  endDate: Date;
}

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
  execute(carId: string, params: UpdateCarSchema): Promise<Car>;
}

export interface IPostgresReserveCarRepository {
  execute(data: CreateBookingDTO): Promise<Booking>;
}
