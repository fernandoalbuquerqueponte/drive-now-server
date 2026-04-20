import { z } from "zod/v4";

export const baseUserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  imageUrl: z.string().url().nullable().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z
    .email({
      message: "Please provide a valid e-mail.",
    })
    .trim()
    .min(1, {
      message: "E-mail is required.",
    }),
  password: z.string().trim().min(6, {
    message: "Password must have at least 6 characters.",
  }),
});

export const createUserSchema = baseUserSchema;
export const updateUserSchema = createUserSchema.partial();

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof baseUserSchema>;
