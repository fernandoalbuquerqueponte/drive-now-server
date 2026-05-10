import { faker } from "@faker-js/faker";
import { GetCarsUseCase } from "../../../use-cases/car/get-cars.js";
import { car } from "../../fixtures/car.js";

describe("GetCarsUseCase", () => {
  const userId = faker.string.uuid();

  class GetCarsRepositoryStub {
    async execute() {
      return [
        {
          ...car,
          userId: userId,
        },
      ];
    }
  }

  const makeSut = () => {
    const getCarsRepository = new GetCarsRepositoryStub();
    const sut = new GetCarsUseCase(getCarsRepository);

    return {
      sut,
      getCarsRepository,
    };
  };

  const filters = {
    query: {
      category: "SUV",
    },
  };

  it("should get cars successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(filters);

    expect(result).toEqual([
      {
        ...car,
        userId: userId,
      },
    ]);
  });
});
