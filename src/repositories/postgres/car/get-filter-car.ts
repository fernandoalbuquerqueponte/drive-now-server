/* eslint-disable @typescript-eslint/no-explicit-any */

import prismaClient from "../../../../prisma/prisma.js";

export class PostgresGetFilterCars {
  async execute(filters: any) {
    const where: any = { AND: [] };

    if (filters.search) {
      where.AND.push({
        OR: [
          { brand: { contains: filters.search, mode: "insensitive" } },
          { model: { contains: filters.search, mode: "insensitive" } },
        ],
      });
    }

    if (filters.category) where.AND.push({ category: filters.category });

    if (filters.priceRange) {
      const ranges: Record<string, any> = {
        "Até R$ 50/h": { pricePerHour: { lte: 50 } },
        "R$ 50 - R$ 100/h": { pricePerHour: { gte: 50, lte: 100 } },
        "R$ 100 - R$ 200/h": { pricePerHour: { gte: 100, lte: 200 } },
        "Acima de R$ 200/h": { pricePerHour: { gte: 200 } },
      };
      if (ranges[filters.priceRange])
        where.AND.push(ranges[filters.priceRange]);
    }

    if (filters.transmission) {
      where.AND.push({
        specifications: {
          path: "$[*]", // Procura em qualquer elemento do array JSON
          array_contains: { label: "Transmissão", value: filters.transmission },
        },
      });
    }

    // FILTRO DE COMBUSTÍVEL EM CAMPO JSON
    if (filters.fuel) {
      where.AND.push({
        specifications: {
          path: "$[*]",
          array_contains: { label: "Combustível", value: filters.fuel },
        },
      });
    }

    return await prismaClient.car.findMany({
      where,
    });
  }
}
