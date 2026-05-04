import prismaClient from "../../../../prisma/prisma.js";
import { PostgresAddCarReviewRepository } from "../../../repositories/postgres/car/add-car-review.js";
import { buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("PostgresAddCarReviewRepository", () => {
  it("should create a car review successfully", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });

    const sut = new PostgresAddCarReviewRepository();

    const result = await sut.execute({
      carId: createdCar.id,
      userId: createdUser.id,
      rating: 5,
      comment: "Excelente carro!",
    });

    expect(result).toBeDefined();
    expect(result.carId).toBe(createdCar.id);
    expect(result.userId).toBe(createdUser.id);
    expect(result.rating).toBe(5);
  });

  it("should call prisma.review.create with correct params", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });
    const sut = new PostgresAddCarReviewRepository();
    const prismaSpy = jest.spyOn(prismaClient.review, "create");

    await sut.execute({
      carId: createdCar.id,
      userId: createdUser.id,
      rating: 4,
      comment: "Muito bom",
    });

    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        carId: createdCar.id,
        userId: createdUser.id,
        rating: 4,
        comment: "Muito bom",
      },
    });
  });
});
