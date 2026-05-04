import prismaClient from "../../../../prisma/prisma.js";
import { GetCarReviewsRepository } from "../../../repositories/postgres/car/get-car-reviews.js";
import { buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("GetCarReviewsRepository", () => {
  it("should get car reviews successfully", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });

    const reviewData = {
      comment: "Ótimo carro!",
      rating: 5,
      carId: createdCar.id,
      userId: createdUser.id,
    };

    await prismaClient.review.create({ data: reviewData });

    const sut = new GetCarReviewsRepository();
    const result = await sut.execute(createdCar.id);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it("should call prisma with correct params", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
      },
    });
    const sut = new GetCarReviewsRepository();
    const prismaSpy = jest.spyOn(prismaClient.review, "findMany");

    await sut.execute(createdCar.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        carId: createdCar.id,
      },
      include: {
        user: true,
      },
    });
  });
});
