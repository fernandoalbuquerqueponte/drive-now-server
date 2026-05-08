import { BookingNotFound } from "../../errors/car.js";
import { ForbiddenError } from "../../errors/user.js";
import type { PostgresCancelBookingRepository } from "../../repositories/postgres/car/cancel-booking.js";
import type { PostgresFindBooking } from "../../repositories/postgres/car/find-booking.js";

export class CancelBookingUseCase {
  constructor(
    private cancelBookingRepository: PostgresCancelBookingRepository,
    private findBookingRepository: PostgresFindBooking,
  ) {}
  async execute(bookingId: string, userId: string) {
    const booking = await this.findBookingRepository.execute(bookingId);

    if (!booking) {
      throw new BookingNotFound();
    }

    if (booking?.userId !== userId) {
      throw new ForbiddenError();
    }

    const updatedBooking =
      await this.cancelBookingRepository.execute(bookingId);

    return updatedBooking;
  }
}
