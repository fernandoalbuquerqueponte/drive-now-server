import prismaClient from "../../../../prisma/prisma.js";
import { PostgresGetUserByIdRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";

describe("GetUserByIdRepository", () => {
  it("should return a user successfully", async () => {
    await prismaClient.user.create({ data: user });

    const sut = new PostgresGetUserByIdRepository();

    const result = await sut.execute(user.id);

    expect(result).toEqual({
      ...user,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });
});
