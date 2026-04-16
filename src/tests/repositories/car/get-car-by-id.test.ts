import prismaClient from "../../../../prisma/prisma.js";
import { PostgresGetCarByIdRepository } from "../../../repositories/postgres/car/get-car-by-id.js";
import { car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("GetCarByIdRepository", () => {
  it("should get a car by id from db", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...car,
        user_id: user.id,
      },
    });

    const sut = new PostgresGetCarByIdRepository();

    const result = await sut.execute(createdCar.id);

    expect(result?.id);
  });
});
