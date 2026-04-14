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

    const deletedUserInDb = await prismaClient.user.findUnique({
      where: { id: user.id },
    });
    expect(deletedUserInDb).toBeNull();
  });

  it("should call prisma with correct params", async () => {
    await prismaClient.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();
    const executeSpy = jest.spyOn(prismaClient.user, "delete");

    await sut.execute(user.id);

    expect(executeSpy).toHaveBeenCalledWith({
      where: { id: user.id },
    });
  });

  it("should throw if prisma throws", async () => {
    const sut = new PostgresDeleteUserRepository();
    jest.spyOn(prismaClient.user, "delete").mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
