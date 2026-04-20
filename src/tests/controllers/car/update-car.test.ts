/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCarController } from "../../../controllers/car/update-car.js";
import type { UpdateCarUseCase } from "../../../use-cases/car/update-car.js";
import { faker } from "@faker-js/faker";
import { car } from "../../fixtures/index.js";
import { ForbiddenError } from "../../../errors/user.js";

describe("UpdateCarController", () => {
  class UpdateCarUseCaseStub {
    async execute() {
      return car;
    }
  }

  const httpRequest = {
    carId: faker.string.uuid(),
    userId: faker.string.uuid(),
    body: {
      ...car,
    },
  };

  const makeSut = () => {
    const updateCarUseCase =
      new UpdateCarUseCaseStub() as unknown as UpdateCarUseCase;
    const sut = new UpdateCarController(updateCarUseCase);

    return { sut, updateCarUseCase };
  };

  it("should update a car successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      carId: "invalid_id",
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      carId: null as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: "invalid_id",
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: null as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 when invalid specifications is provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        specifications: [{ label: "Motor" }] as any,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if features are invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        features: "invalid_features" as any,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if image is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        image: "invalid_url",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if gallery is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        gallery: ["invalid_url1", "invalid_url2"],
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 500 if throws generic error", async () => {
    const { sut, updateCarUseCase } = makeSut();

    jest.spyOn(updateCarUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should call UpdateCarUseCase with correct params", async () => {
    const { sut, updateCarUseCase } = makeSut();
    const executeSpy = jest.spyOn(updateCarUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.carId,
      httpRequest.body,
      httpRequest.userId,
    );
  });

  it("should return 400 if ForbiddenError throws", async () => {
    const { sut, updateCarUseCase } = makeSut();
    jest
      .spyOn(updateCarUseCase, "execute")
      .mockRejectedValueOnce(new ForbiddenError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });
});
