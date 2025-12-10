import { z } from "zod/v4";

export const createCarSchema = z.object({
  brand: z.string(),
  model: z.string(),
  category: z.string(),
  image: z.string().url(),
  year: z.number().int(),
  pricePerHour: z.number().positive(),
  description: z.string(),

  specifications: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),

  features: z.array(z.string()),

  images: z
    .array(
      z.object({
        url: z.string().url(),
      })
    )
    .optional(),
});

export type CreateCarSchema = z.infer<typeof createCarSchema>;
