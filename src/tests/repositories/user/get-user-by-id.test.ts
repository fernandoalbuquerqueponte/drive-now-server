import prismaClient from "../../../../prisma/prisma.js";
import { PostgresGetUserByIdRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";

describe("GetUserByIdRepository", () => {
  const userWithoutPassword = {
    ...user,
    password: undefined,
  };
  it("should return a user successfully", async () => {
    await prismaClient.user.create({ data: user });

    const sut = new PostgresGetUserByIdRepository();

    const result = await sut.execute(user.id);

    expect(result).toEqual({
      ...userWithoutPassword,
      bookings: [],
      cars: [],
      reviews: [],
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
    const findFirstSpy = jest.spyOn(prismaClient.user, "findUnique");

    const sut = new PostgresGetUserByIdRepository();

    await sut.execute("any-user-id");

    expect(findFirstSpy).toHaveBeenCalledWith({
      where: { id: "any-user-id" },
      include: {
        bookings: { include: { car: true } },
        reviews: { include: { car: true } },
        cars: { include: { bookings: true } },
      },
    });
  });

  it("should throw an error if prisma throws an error", async () => {
    const sut = new PostgresGetUserByIdRepository();
    jest.spyOn(prismaClient.user, "findUnique").mockRejectedValue(new Error());

    const promise = sut.execute("any-user-id");

    await expect(promise).rejects.toThrow();
  });
});
