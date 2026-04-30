/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PostgresGetFilterCars } from "../../repositories/postgres/car/get-filter-car.js";

export class GetFilterCarUseCase {
  constructor(private getFilterCar: PostgresGetFilterCars) {}
  async execute(filters: any) {
    const cars = await this.getFilterCar.execute(filters);
    return cars;
  }
}
