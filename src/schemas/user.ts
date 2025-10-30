import { z } from "zod/v4";

export const createUserSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  imageUrl: z.url().optional().nullable(),
  email: z.email().min(1, "E-mail is required."),
  password: z
    .string()
    .trim()
    .min(6, "Password must have at least 6 characters."),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
