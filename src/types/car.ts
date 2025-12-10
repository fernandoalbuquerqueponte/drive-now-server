import type { Car } from "@prisma/client";
import type { CreateCarSchema } from "../schemas/car.js";

export interface ICreateCarRepository {
  execute(params: CreateCarSchema): Promise<Car | undefined>;
}
