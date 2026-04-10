import { faker } from "@faker-js/faker";
import type {
  IGetCarReviewsRepository,
  IPostgresGetCarByIdRepository,
} from "../../../types/car.js";
import { GetCarReviewsUseCase } from "../../../use-cases/car/get-car-reviews.js";
import { review } from "../../fixtures/car.js";
import { CarNotFoundError } from "../../../errors/car.js";

describe("GetCarReviewsUseCase", () => {
  const carId = faker.string.uuid();

  class GetCarReviewsRepositoryStub {
    async execute() {
      return review;
    }
  }

  class GetCarByIdRepositoryStub {
    async execute() {
      return carId;
    }
  }

  const makeSut = () => {
    const getCarReviewsRepositoryStub =
      new GetCarReviewsRepositoryStub() as unknown as IGetCarReviewsRepository;

    const getCarByIdRepositoryStub =
      new GetCarByIdRepositoryStub() as unknown as IPostgresGetCarByIdRepository;

    const sut = new GetCarReviewsUseCase(
      getCarReviewsRepositoryStub,
      getCarByIdRepositoryStub,
    );

    return { getCarReviewsRepositoryStub, getCarByIdRepositoryStub, sut };
  };

  it("should return car reviews", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(carId);

    expect(result).toEqual(review);
  });

  it("should throw CarNotFoundError if car does not exist", async () => {
    const { sut, getCarByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getCarByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(undefined);

    const promise = sut.execute(carId);

    await expect(promise).rejects.toThrow(new CarNotFoundError());
  });
});
