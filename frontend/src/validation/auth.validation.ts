import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
