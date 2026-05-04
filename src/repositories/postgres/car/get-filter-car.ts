/* eslint-disable @typescript-eslint/no-explicit-any */
import prismaClient from "../../../../prisma/prisma.js";

export class PostgresGetFilterCars {
  async execute(filters: any) {
    const conditions = [];

    if (filters.search) {
      conditions.push({
        OR: [
          { brand: { contains: filters.search, mode: "insensitive" } },
          { model: { contains: filters.search, mode: "insensitive" } },
        ],
      });
    }

    if (filters.category) {
      conditions.push({
        category: { equals: filters.category, mode: "insensitive" },
      });
    }

    if (filters.priceRange) {
      const ranges: Record<string, any> = {
        "Até R$ 50/h": { pricePerHour: { lte: 50 } },
        "R$ 50 - R$ 100/h": { pricePerHour: { gte: 50, lte: 100 } },
        "R$ 100 - R$ 200/h": { pricePerHour: { gte: 100, lte: 200 } },
        "Acima de R$ 200/h": { pricePerHour: { gte: 200 } },
      };
      if (ranges[filters.priceRange])
        conditions.push(ranges[filters.priceRange]);
    }

    if (filters.transmission) {
      conditions.push({
        specifications: {
          some: {
            label: { equals: "Transmissão", mode: "insensitive" },
            value: { equals: filters.transmission, mode: "insensitive" },
          },
        },
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    return await prismaClient.car.findMany({
      where,
      include: {
        specifications: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
