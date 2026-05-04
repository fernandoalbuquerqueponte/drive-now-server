import prismaClient from "../../../../prisma/prisma.js";
import { PostgresGetCarByIdRepository } from "../../../repositories/postgres/car/get-car-by-id.js";
import { buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("GetCarByIdRepository", () => {
  it("should get a car by id from db", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: user.id,
      },
    });

    const sut = new PostgresGetCarByIdRepository();

    const result = await sut.execute(createdCar.id);

    expect(result?.id);
  });

  it("should return undefined if no car is found", async () => {
    const sut = new PostgresGetCarByIdRepository();

    const result = await sut.execute("any_id");

    expect(result).toBeUndefined();
  });

  it("should call prisma with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: user.id,
      },
    });
    const sut = new PostgresGetCarByIdRepository();
    const prismaSpy = jest.spyOn(prismaClient.car, "findUnique");

    await sut.execute(createdCar.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: createdCar.id,
      },
    });
  });
});
