import { faker } from "@faker-js/faker";
import prismaClient from "../../../../prisma/prisma.js";
import { PostgresUpdateUserRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";
import { Prisma } from "@prisma/client";

describe("UpdateUserRepository", () => {
  const updateUserParams = {
    id: user.id,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    imageUrl: faker.image.url(),
    email: faker.internet.email(),
  };

  it("should update a user successfully", async () => {
    await prismaClient.user.create({ data: user });
    const sut = new PostgresUpdateUserRepository();

    const result = await sut.execute(user.id, updateUserParams);

    expect(result).toStrictEqual(updateUserParams);
  });

  it("should call prisma with correct params", async () => {
    const sut = new PostgresUpdateUserRepository();
    const prismaSpy = jest.spyOn(prismaClient.user, "update");

    await sut.execute(user.id, updateUserParams);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: user.id },
      data: updateUserParams,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        imageUrl: true,
      },
    });
  });

  it("should throw a generic error if prisma throws", async () => {
    const sut = new PostgresUpdateUserRepository();
    jest.spyOn(prismaClient.user, "update").mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, updateUserParams);

    await expect(promise).rejects.toThrow();
  });

  it("should return null if prisma throws P2025 (Record not found)", async () => {
    const sut = new PostgresUpdateUserRepository();

    jest.spyOn(prismaClient.user, "update").mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Record to update not found.", {
        code: "P2025",
        clientVersion: "5.x",
      }),
    );

    const result = await sut.execute("id-inexistente", updateUserParams);

    expect(result).toBeNull();
  });

  it("should throw error if prisma throws a KnownRequestError with a code different from P2025", async () => {
    const sut = new PostgresUpdateUserRepository();

    jest.spyOn(prismaClient.user, "update").mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.x",
      }),
    );

    const promise = sut.execute(user.id, updateUserParams);

    await expect(promise).rejects.toThrow();
  });
});
