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

  it("should call GetBookingsByCarIdUseCase with correct params", async () => {
    const { sut, getBookingsByCarIdUseCase } = makeSut();
    const executeSpy = jest.spyOn(getBookingsByCarIdUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(carId);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute({
      ...httpRequest,
      params: {
        carId: "invalid_car_id",
      },
    });

    expect(bookings.statusCode).toBe(400);
  });
});
