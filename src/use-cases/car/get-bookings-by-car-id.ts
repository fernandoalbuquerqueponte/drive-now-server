import type { PostgresGetBookingsByCarIdRepository } from "../../repositories/postgres/car/get-bookings-by-car-id.js";

export class GetBookingsByCarIdUseCase {
  constructor(
    private getBookingsRepository: PostgresGetBookingsByCarIdRepository,
  ) {
    this.getBookingsRepository = getBookingsRepository;
  }
  async execute(carId: string) {
    const bookings = await this.getBookingsRepository.execute(carId);

    return bookings;
  }
}
