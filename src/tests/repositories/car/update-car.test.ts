import prismaClient from "../../../../prisma/prisma.js";
import { PostgresUpdateCarRepository } from "../../../repositories/postgres/car/update-car.js";
import { car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("UpdateCarRepository", () => {
  it("should update car successfully", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...car,
        user_id: user.id,
      },
    });

    const sut = new PostgresUpdateCarRepository();
    const updateData = { ...car, brand: "Nome Novo" };

    const result = await sut.execute(createdCar.id, updateData);

    expect(result.id).toBe(createdCar.id);
    expect(result.brand).toBe("Nome Novo");

    const carInDb = await prismaClient.car.findUnique({
      where: { id: createdCar.id },
    });
    expect(carInDb?.brand).toBe("Nome Novo");
  });

  it("should call prisma with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...car,
        user_id: user.id,
      },
    });

    const sut = new PostgresUpdateCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.car, "update");

    await sut.execute(createdCar.id, car);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: createdCar.id,
      },
      data: {
        ...car,
        ...(car.gallery && {
          gallery: {
            set: car.gallery,
          },
        }),
      },
    });
  });
});
