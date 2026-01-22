import type { Booking } from "@prisma/client";
import { CarNotFoundError } from "../../errors/car.js";
import type {
  CreateBookingDTO,
  IPostgresGetCarByIdRepository,
  IPostgresReserveCarRepository,
  ReserveCarInputDTO,
} from "../../types/car.js";

export class ReserveCarUseCase {
  constructor(
    private reserveCarRepository: IPostgresReserveCarRepository,
    private getCarByIdRepository: IPostgresGetCarByIdRepository,
  ) {
    this.reserveCarRepository = reserveCarRepository;
    this.getCarByIdRepository = getCarByIdRepository;
  }
  async execute(
    carId: string,
    userId: string,
    params: ReserveCarInputDTO,
  ): Promise<Booking> {
    const car = await this.getCarByIdRepository.execute(carId);

    if (!car) {
      throw new CarNotFoundError();
    }

    const hours = params.endDate.getTime() - params.startDate.getTime();
    const totalHours = hours / (1000 * 60 * 60);

    if (totalHours <= 0) {
      throw new Error("Invalid booking duration");
    }

    const totalPrice = car.pricePerHour * totalHours;

    const bookingData: CreateBookingDTO = {
      ...params,
      carId: carId,
      userId: userId,
      totalPrice,
      totalHours,
      status: "PENDING",
    };

    const createdBooking = await this.reserveCarRepository.execute(bookingData);

    return createdBooking;
  }
}
