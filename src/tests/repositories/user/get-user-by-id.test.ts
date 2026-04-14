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

  it("should return null if user is not found", async () => {
    const sut = new PostgresGetUserByIdRepository();

    const result = await sut.execute("non-existing-user-id");

    expect(result).toBeNull();
  });

  it("should call prisma with correct params", async () => {
    const findFirstSpy = jest.spyOn(prismaClient.user, "findFirst");

    const sut = new PostgresGetUserByIdRepository();

    await sut.execute("any-user-id");

    expect(findFirstSpy).toHaveBeenCalledWith({
      where: {
        id: "any-user-id",
      },
    });
  });
});
