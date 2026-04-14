import prismaClient from "../../../../prisma/prisma.js";
import { PostgresDeleteUserRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";

describe("DeleteUserRepository", () => {
  it("should delete an user from db", async () => {
    await prismaClient.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual({
      ...user,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });
});
