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
});
