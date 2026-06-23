import { z } from "zod";

// login schema
export const loginSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});
export type LoginSchema = z.infer<typeof loginSchema>;

// register schema
export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    email: z.email("Please enter a valid email address").trim(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
