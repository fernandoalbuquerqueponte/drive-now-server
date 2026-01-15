export class CarNotFoundError extends Error {
  constructor() {
    super("Car not found");
    this.name = "CarNotFoundError";
  }
}
