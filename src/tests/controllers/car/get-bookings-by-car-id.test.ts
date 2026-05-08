import { faker } from "@faker-js/faker";
import { GetBookingsByCarIdController } from "../../../controllers/car/get-bookings-by-car-id.js";
import type { GetBookingsByCarIdUseCase } from "../../../use-cases/car/get-bookings-by-car-id.js";

describe("GetBookingsByCarIdController", () => {
  const carId = faker.string.uuid();

  class GetBookingsByCarIdUseCaseStub {
    async execute() {
      return {
        carId: carId,
      };
    }
  }

  const makeSut = () => {
    const getBookingsByCarIdUseCase =
      new GetBookingsByCarIdUseCaseStub() as unknown as GetBookingsByCarIdUseCase;

    const sut = new GetBookingsByCarIdController(getBookingsByCarIdUseCase);

    return {
      sut,
      getBookingsByCarIdUseCase,
    };
  };

  const httpRequest = {
    params: {
      carId: carId,
    },
  };

  it("should get bookings by car id successfully", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute(httpRequest);

    expect(bookings.statusCode).toBe(200);
  });
});
