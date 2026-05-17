/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const createCarSchema = z.object({
  brand: z.string(),
  model: z.string(),
  category: z.string(),
  image: z.url(),
  gallery: z.array(z.string().url()).optional(),
  year: z.coerce.number().int().min(1900, "Ano inválido"),
  pricePerHour: z.coerce
    .number()
    .min(0, "O preço deve ser maior ou igual a zero"),
  description: z.string(),
  available: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .default(true),

  specifications: z
    .preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val),
      z.array(
        z.object({
          label: z.string().min(1),
          value: z.string().min(1, "O valor é obrigatório"),
        }),
      ),
    )
    .default([]),

  features: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const parsed = JSON.parse(val);
        return parsed.map((f: any) => (typeof f === "object" ? f.value : f));
      }
      return val;
    }, z.array(z.string()))
    .default([]),
});

export const getCarsSchema = z.object({
  query: z
    .object({
      search: z.string().optional(),
      category: z.string().optional(),
      priceRange: z.string().optional(),
      transmission: z.string().optional(),
      fuel: z.string().optional(),
    })
    .optional(),
});

export const createReserveSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const deleteCarSchema = z.object({
  carId: z.string().uuid(),
});

export const updateCarSchema = createCarSchema.partial();

export const updateCarParamsSchema = z.object({
  carId: z.string().uuid("Invalid carId"),
  userId: z.string().uuid("Invalid userId"),
});

export type CreateCarSchema = z.infer<typeof createCarSchema>;
export type UpdateCarSchema = z.infer<typeof updateCarSchema>;
export type CreateReviewDTO = z.infer<typeof createReviewSchema>;
