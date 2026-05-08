/* eslint-disable @typescript-eslint/no-explicit-any */
import prismaClient from "../../../../prisma/prisma.js";

export class GetCarRepository {
  async execute(filters?: any) {
    const conditions = [];
    if (filters?.search) {
      conditions.push({
        OR: [
          { brand: { contains: filters.search, mode: "insensitive" } },
          { model: { contains: filters.search, mode: "insensitive" } },
        ],
      });
    }

    if (
      filters?.category &&
      filters.category !== "Todas" &&
      filters.category !== "Todos"
    ) {
      conditions.push({
        category: { equals: filters.category, mode: "insensitive" },
      });
    }

    if (filters?.priceRange) {
      const ranges: Record<string, any> = {
        "Até R$ 50/h": { pricePerHour: { lte: 50 } },
        "R$ 50 - R$ 100/h": { pricePerHour: { gte: 50, lte: 100 } },
        "R$ 100 - R$ 200/h": { pricePerHour: { gte: 100, lte: 200 } },
        "Acima de R$ 200/h": { pricePerHour: { gte: 200 } },
      };

      const selectedRange = ranges[filters.priceRange];
      if (selectedRange) {
        conditions.push(selectedRange);
      }
    }

    if (
      filters?.transmission &&
      filters.transmission !== "Todas" &&
      filters.transmission !== "Todos"
    ) {
      conditions.push({
        specifications: {
          some: {
            label: { equals: "Transmissão", mode: "insensitive" },
            value: { equals: filters.transmission, mode: "insensitive" },
          },
        },
      });
    }

    if (filters?.fuel && filters.fuel !== "Todas" && filters.fuel !== "Todos") {
      conditions.push({
        specifications: {
          some: {
            label: { equals: "Combustível", mode: "insensitive" },
            value: { equals: filters.fuel, mode: "insensitive" },
          },
        },
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    return await prismaClient.car.findMany({
      where,
      include: {
        specifications: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
