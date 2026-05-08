import { z } from "zod";

export const createCarSchema = z.object({
  brand: z.string(),
  model: z.string(),
  category: z.string(),

  image: z.string().url(),

  gallery: z.array(z.string().url()).optional(),

  year: z.number().int(),
  pricePerHour: z.number().positive(),
  description: z.string(),
  available: z.boolean().optional(),

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
