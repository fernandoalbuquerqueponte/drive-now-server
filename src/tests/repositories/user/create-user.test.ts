import prismaClient from "../../../../prisma/prisma.js";
import { PostgresCreateUserRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";

describe("CreateUserRepository", () => {
  const userWithoutId = { ...user, id: undefined };

  it("should create an user on db", async () => {
    const sut = new PostgresCreateUserRepository();

    const result = await sut.execute(userWithoutId);

    expect(result.first_name).toBe(userWithoutId.first_name);
    expect(result.last_name).toBe(userWithoutId.last_name);
    expect(result.email).toBe(userWithoutId.email);
    expect(result.imageUrl).toBe(userWithoutId.imageUrl);
  });

  it("should create user without imageUrl", async () => {
    const sut = new PostgresCreateUserRepository();

    const result = await sut.execute({
      ...userWithoutId,
      imageUrl: null,
    });

    expect(result.first_name).toBe(userWithoutId.first_name);
    expect(result.last_name).toBe(userWithoutId.last_name);
    expect(result.email).toBe(userWithoutId.email);
    expect(result.imageUrl).toBeNull();
  });

  it("should call prisma with correct params", () => {
    const sut = new PostgresCreateUserRepository();
    const executeSpy = jest.spyOn(prismaClient.user, "create");

    sut.execute(userWithoutId);

    expect(executeSpy).toHaveBeenCalledWith({
      data: userWithoutId,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        imageUrl: true,
      },
    });
  });

  it("should throw if prisma throws", async () => {
    const sut = new PostgresCreateUserRepository();
    jest.spyOn(prismaClient.user, "create").mockRejectedValueOnce(new Error());

    const promise = sut.execute(userWithoutId);

    await expect(promise).rejects.toThrow();
  });
});
