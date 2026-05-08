export class CarNotFoundError extends Error {
  constructor() {
    super("Car not found");
    this.name = "CarNotFoundError";
  }
}

export class BookingNotFound extends Error {
  constructor() {
    super("Booking not found");
    this.name = "BookingNotFoundError";
  }
}
