import { faker } from "@faker-js/faker";
import prismaClient from "../../../../prisma/prisma.js";
import { PostgresUpdateUserRepository } from "../../../repositories/postgres/index.js";
import { user } from "../../fixtures/user.js";

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
});
