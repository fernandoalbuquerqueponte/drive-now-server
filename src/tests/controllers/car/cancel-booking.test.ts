import { faker } from "@faker-js/faker";
import { CancelBookingController } from "../../../controllers/car/cancel-booking.js";
import type { CancelBookingUseCase } from "../../../use-cases/car/cancel-booking.js";
const userId = faker.string.uuid();
const bookingId = faker.string.uuid();

describe("CancelBookingController", () => {
  class CancelBookingUseCaseStub {
    async execute() {
      return {
        bookingId: bookingId,
      };
    }
  }

  const makeSut = () => {
    const cancelBookingUseCase =
      new CancelBookingUseCaseStub() as unknown as CancelBookingUseCase;
    const sut = new CancelBookingController(cancelBookingUseCase);

    return {
      sut,
      cancelBookingUseCase,
    };
  };

  const httpRequest = {
    userId: userId,
    params: {
      bookingId: bookingId,
    },
  };

  it("should return 200 when booking is cancelled successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should call CancelBookingUseCase with correct params", async () => {
    const { sut, cancelBookingUseCase } = makeSut();
    const executeSpy = jest.spyOn(cancelBookingUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(bookingId, userId);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: "invalid_user_id",
    });

    expect(result.statusCode).toBe(400);
  });
});
