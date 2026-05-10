import prismaClient from "../../../../prisma/prisma.js";
import { GetCarRepository } from "../../../repositories/postgres/car/get-cars.js";
import { buildPrismaCarData, car } from "../../fixtures/car.js";
import { user } from "../../fixtures/user.js";

describe("GetCarRepository", () => {
  it("should return cars filtered by search (brand or model)", async () => {
    const createdUser = await prismaClient.user.create({ data: user });
    const carData = buildPrismaCarData(car);
    await prismaClient.car.create({
      data: {
        ...carData,
        brand: "Toyota",
        model: "Corolla",
        user_id: createdUser.id,
      },
    });

    const sut = new GetCarRepository();

    const result = await sut.execute({ search: "toyota" });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]!.brand).toBe("Toyota");
  });

  it("should return cars filtered by category", async () => {
    const createdUser = await prismaClient.user.create({ data: user });

    await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        category: "SUV",
        user_id: createdUser.id,
      },
    });

    const sut = new GetCarRepository();

    const result = await sut.execute({ category: "SUV" });

    expect(result[0]!.category).toBe("SUV");
  });

  it("should return cars filtered by pricePerHour range", async () => {
    const createdUser = await prismaClient.user.create({ data: user });

    await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        pricePerHour: 40,
        user_id: createdUser.id,
      },
    });

    const sut = new GetCarRepository();

    const result = await sut.execute({ priceRange: "Até R$ 50/h" });

    expect(result.length).toBe(1);
    expect(Number(result[0]!.pricePerHour)).toBeLessThanOrEqual(50);
  });

  it("should return cars filtered by transmission (specification)", async () => {
    const createdUser = await prismaClient.user.create({ data: user });

    await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
        specifications: {
          create: [{ label: "Transmissão", value: "Automático" }],
        },
      },
    });

    const sut = new GetCarRepository();

    const result = await sut.execute({ transmission: "Automático" });

    expect(result.length).toBe(1);
    expect(result[0]!.specifications[0]!.value).toBe("Automático");
  });

  it("should call prisma with correct params and include specifications", async () => {
    const sut = new GetCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.car, "findMany");

    const filters = { category: "SUV" };
    await sut.execute(filters);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        AND: [{ category: { equals: "SUV", mode: "insensitive" } }],
      },
      include: {
        specifications: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return cars filtered by fuel (specification)", async () => {
    const createdUser = await prismaClient.user.create({ data: user });

    await prismaClient.car.create({
      data: {
        ...buildPrismaCarData(car),
        user_id: createdUser.id,
        specifications: {
          create: [{ label: "Combustível", value: "Flex" }],
        },
      },
    });

    const sut = new GetCarRepository();

    const result = await sut.execute({ fuel: "Flex" });

    expect(result.length).toBe(1);

    const fuelSpec = result[0]!.specifications.find(
      (s) => s.label === "Combustível",
    );
    expect(fuelSpec?.value).toBe("Flex");
  });

  it("should not apply price filter if an invalid priceRange is provided", async () => {
    const sut = new GetCarRepository();
    const prismaSpy = jest.spyOn(prismaClient.car, "findMany");

    await sut.execute({ priceRange: "Preço de Banana" });

    expect(prismaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
      }),
    );

    prismaSpy.mockRestore();
  });
});
