import type { GetCarsUseCase } from "../../../use-cases/car/get-cars.js";
import { GetCarsController } from "../../../controllers/car/get-cars.js";
import { car } from "../../fixtures/car.js";

describe("GetCarsController", () => {
  class GetCarsUseCaseStub {
    async execute() {
      return car;
    }
  }

  const makeSut = () => {
    const getCarsUseCase =
      new GetCarsUseCaseStub() as unknown as GetCarsUseCase;

    const sut = new GetCarsController(getCarsUseCase);

    return {
      sut,
      getCarsUseCase,
    };
  };

  it("should get cars successfully", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute();

    expect(bookings.statusCode).toBe(200);
  });

  it("should return 500 if throws generic error", async () => {
    const { sut, getCarsUseCase } = makeSut();
    jest.spyOn(getCarsUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.execute();

    expect(result.statusCode).toBe(500);
  });
});
