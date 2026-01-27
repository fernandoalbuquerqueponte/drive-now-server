import { z } from "zod/v3";

export const createCarSchema = z.object({
  brand: z.string(),
  model: z.string(),
  category: z.string(),

  image: z.string().url(), // imagem principal

  gallery: z.array(z.string().url()).optional(), // galeria de imagens

  year: z.number().int(),
  pricePerHour: z.number().positive(),
  description: z.string(),

  specifications: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),

  features: z.array(z.string()),
});

export const createReserveSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
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
