import type { PostgresGetBookingsCarByUserId } from "../../repositories/postgres/car/get-bookings-car-by-user-id.js";

export class GetBookingsCarByUserIdUseCase {
  constructor(private getBookingsCarByUserId: PostgresGetBookingsCarByUserId) {
    this.getBookingsCarByUserId = getBookingsCarByUserId;
  }
  async execute(userId: string) {
    const bookings = await this.getBookingsCarByUserId.execute(userId);

    return bookings;
  }
}
