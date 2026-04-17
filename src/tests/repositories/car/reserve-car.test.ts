import prismaClient from "../../../../prisma/prisma.js";
import { PostgresReserveCarRepository } from "../../../repositories/postgres/car/reserve-car.js";
import { booking, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("ReserveCarRepository", () => {
  it("should booking a car successfully", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...car,
        user_id: user.id,
      },
    });

    const sut = new PostgresReserveCarRepository();

    const result = await sut.execute({
      ...booking,
      carId: createdCar.id,
      userId: user.id,
    });

    expect(result.id).toBe(booking.id);
  });
});
