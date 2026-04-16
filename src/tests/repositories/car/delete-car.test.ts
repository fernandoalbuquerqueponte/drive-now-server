import { PostgresDeleteCarRepository } from "../../../repositories/postgres/car/delete-car.js";
import { car } from "../../fixtures/car.js";
import prismaClient from "../../../../prisma/prisma.js";
import { user } from "../../fixtures/user.js";

describe("DeleteCarRepository", () => {
  it("should delete a car sucessfully", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...car,
        user_id: user.id,
      },
    });

    const sut = new PostgresDeleteCarRepository();

    const result = await sut.execute(createdCar.id);

    expect(result.id).toBe(createdCar.id);
    expect(result.brand).toBe(car.brand);

    const fetchCarInDb = await prismaClient.car.findFirst({
      where: { id: createdCar.id },
    });

    expect(fetchCarInDb).toBeNull();
  });
});
