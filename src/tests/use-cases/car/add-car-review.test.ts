import { AddCarReviewUseCase } from "../../../use-cases/car/add-car-review.js";
import { review } from "../../fixtures/car.js";

const makeGetCarByIdRepository = () => {
  class GetCarByIdRepositoryStub {
    async execute() {
      return { id: "car-id" };
    }
  }

  return new GetCarByIdRepositoryStub();
};

const makeAddCarReviewRepository = () => {
  class AddCarReviewRepositoryStub {
    async execute() {
      return review;
    }
  }

  return new AddCarReviewRepositoryStub();
};

describe("AddCarReviewUseCase", () => {
  it("should add a review successfully", async () => {
    const addCarReviewRepositoryStub = makeAddCarReviewRepository();
    const getCarByIdRepositoryStub = makeGetCarByIdRepository();
    const sut = new AddCarReviewUseCase(
      addCarReviewRepositoryStub as any,
      getCarByIdRepositoryStub as any,
    );

    const result = await sut.execute("car-id", "user-id", {
      rating: 5,
      comment: "Ótimo",
    });

    expect(result).toEqual(review);
  });

  it("should call AddCarReviewRepository with correct values", async () => {
    const addCarReviewRepositoryStub = makeAddCarReviewRepository();
    const getCarByIdRepositoryStub = makeGetCarByIdRepository();
    const sut = new AddCarReviewUseCase(
      addCarReviewRepositoryStub as any,
      getCarByIdRepositoryStub as any,
    );
    const executeSpy = jest.spyOn(addCarReviewRepositoryStub, "execute");

    await sut.execute("car-id", "user-id", {
      rating: 4,
      comment: "Muito bom",
    });

    expect(executeSpy).toHaveBeenCalledWith({
      carId: "car-id",
      userId: "user-id",
      rating: 4,
      comment: "Muito bom",
    });
  });

  it("should throw if car is not found", async () => {
    class GetCarByIdRepositoryStub {
      async execute() {
        return undefined;
      }
    }

    const addCarReviewRepositoryStub = makeAddCarReviewRepository();
    const getCarByIdRepositoryStub = new GetCarByIdRepositoryStub();
    const sut = new AddCarReviewUseCase(
      addCarReviewRepositoryStub as any,
      getCarByIdRepositoryStub as any,
    );

    await expect(
      sut.execute("car-id", "user-id", {
        rating: 5,
        comment: "Ótimo",
      }),
    ).rejects.toThrow("Car not found");
  });

  it("should throw if rating is invalid", async () => {
    const addCarReviewRepositoryStub = makeAddCarReviewRepository();
    const getCarByIdRepositoryStub = makeGetCarByIdRepository();
    const sut = new AddCarReviewUseCase(
      addCarReviewRepositoryStub as any,
      getCarByIdRepositoryStub as any,
    );

    await expect(
      sut.execute("car-id", "user-id", {
        rating: 0,
        comment: "Ruim",
      }),
    ).rejects.toThrow("Rating must be between 1 and 5");
  });
});
