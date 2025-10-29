import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
