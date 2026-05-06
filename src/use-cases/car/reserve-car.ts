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

    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    const hours = endDate.getTime() - startDate.getTime();
    const totalHours = hours / (1000 * 60 * 60);

    if (totalHours <= 0) {
      throw new Error("Invalid booking duration");
    }

    const totalPrice = car.pricePerHour * totalHours;

    const bookingData: CreateBookingDTO = {
      carId: carId,
      userId: userId,
      startDate,
      endDate,
      totalPrice,
      totalHours,
      status: "PENDING",
    };

    const createdBooking = await this.reserveCarRepository.execute(bookingData);

    return createdBooking;
  }
}
