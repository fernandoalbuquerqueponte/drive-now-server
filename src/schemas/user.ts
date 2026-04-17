import { z } from "zod/v4";

export const baseUserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  imageUrl: z.string().url().nullable().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUserSchema = baseUserSchema.omit({ id: true });
export const updateUserSchema = createUserSchema.partial();

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof baseUserSchema>;
