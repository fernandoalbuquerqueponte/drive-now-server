import prismaClient from "../../../../prisma/prisma.js";
import { PostgresEmailIsAlreadyInUseUserRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";

describe("GetUserByEmailRepository", () => {
  it("should return a user successfully", async () => {
    await prismaClient.user.create({ data: user });
    const sut = new PostgresEmailIsAlreadyInUseUserRepository();

    const result = await sut.execute(user.email);

    expect(result).toEqual({
      ...user,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });
});
