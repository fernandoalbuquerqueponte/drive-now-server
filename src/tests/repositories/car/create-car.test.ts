import { PostgresCreateCarRepository } from "../../../repositories/postgres/car/create-car.js";
import { car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";
import prismaClient from "../../../../prisma/prisma.js";

describe("CreateCarRepository", () => {
  it("should create a car successfully", async () => {
    await prismaClient.user.create({ data: user });
    const sut = new PostgresCreateCarRepository();

    const result = await sut.execute(car, user.id);

    expect(result.brand).toBe(car.brand);
    expect(result.user_id).toBe(user.id);
  });

  it("should call prisma with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const sut = new PostgresCreateCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.car, "create");

    await sut.execute(car, user.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...car,
        user_id: user.id,
        specifications: {
          create: car.specifications,
        },
        ...(car.gallery && {
          gallery: {
            set: car.gallery,
          },
        }),
      },
    });
  });
});
