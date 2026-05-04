import { faker } from "@faker-js/faker";
import prismaClient from "../../../../prisma/prisma.js";
import { PostgresReserveCarRepository } from "../../../repositories/postgres/car/reserve-car.js";
import { booking, buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("ReserveCarRepository", () => {
  const startDate = faker.date.soon();
  const endDate = faker.date.future();

  it("should booking a car successfully", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: user.id,
      },
    });

    const sut = new PostgresReserveCarRepository();

    const result = await sut.execute({
      ...booking,
      startDate,
      endDate,
      carId: createdCar.id,
      userId: user.id,
    });

    expect(result.id).toBe(booking.id);
  });

  it("should call prisma(findFirst) with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: user.id,
      },
    });

    const sut = new PostgresReserveCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.booking, "findFirst");

    await sut.execute({
      ...booking,
      startDate,
      endDate,
      carId: createdCar.id,
      userId: user.id,
    });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        carId: createdCar.id,
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
    });
  });

  it("should call prisma(CREATE) with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: user.id,
      },
    });

    const sut = new PostgresReserveCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.booking, "create");

    await sut.execute({
      ...booking,
      startDate,
      endDate,
      carId: createdCar.id,
      userId: user.id,
    });

    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...booking,
        startDate,
        endDate,
        carId: createdCar.id,
        userId: user.id,
      },
    });
  });

  it("should throw error if has conflit with booking dates", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: { ...buildPrismaCarData(car), user_id: user.id },
    });
    await prismaClient.booking.create({
      data: {
        ...booking,
        carId: createdCar.id,
        userId: user.id,
        startDate,
        endDate,
      },
    });
    const sut = new PostgresReserveCarRepository();

    const promise = sut.execute({
      ...booking,
      carId: createdCar.id,
      userId: user.id,
      startDate,
      endDate,
    });

    await expect(promise).rejects.toThrow();
  });
});
