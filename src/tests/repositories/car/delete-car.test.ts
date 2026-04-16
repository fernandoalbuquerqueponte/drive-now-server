import { PostgresDeleteCarRepository } from "../../../repositories/postgres/car/delete-car.js";
import { car } from "../../fixtures/car.js";
import prismaClient from "../../../../prisma/prisma.js";
import { user } from "../../fixtures/user.js";
import { Prisma } from "@prisma/client";
import { CarNotFoundError } from "../../../errors/car.js";

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

  it("should call prisma with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const createdCar = await prismaClient.car.create({
      data: {
        ...car,
        user_id: user.id,
      },
    });
    const sut = new PostgresDeleteCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.car, "delete");

    await sut.execute(createdCar.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: createdCar.id,
      },
    });
  });

  it("should throw a generic error", async () => {
    const sut = new PostgresDeleteCarRepository();
    jest.spyOn(prismaClient.car, "delete").mockRejectedValueOnce(new Error());

    const promise = sut.execute("any-id");

    await expect(promise).rejects.toThrow();
  });

  it("should throw CarNotFoundError if car is not found", async () => {
    // await prismaClient.user.create({ data: user });
    // const createdCar = await prismaClient.car.create({
    //   data: {
    //     ...car,
    //     user_id: user.id,
    //   },
    // });

    const sut = new PostgresDeleteCarRepository();

    // jest.spyOn(prismaClient.car, "delete").mockRejectedValueOnce(
    //   new Prisma.PrismaClientKnownRequestError("Record to update not found.", {
    //     code: "P2025",
    //     clientVersion: "5.x",
    //   }),
    // );

    await expect(sut.execute("invalidId")).rejects.toThrow(
      new CarNotFoundError(),
    );
  });

  it("should throw error if prisma throws a KnownRequestError with a code different from P2025", async () => {
    const sut = new PostgresDeleteCarRepository();

    jest.spyOn(prismaClient.car, "delete").mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.x",
      }),
    );

    const promise = sut.execute("any-id");

    await expect(promise).rejects.toThrow();
  });
});
