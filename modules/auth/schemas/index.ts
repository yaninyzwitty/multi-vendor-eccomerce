import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(63, { message: "Username must be less than 63 characters long" })
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      {
        message: "Username can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number",
      }
    )
    .refine((val) => !val.includes("--"), {
      message: "Username cannot contain consecutive hyphens",
    })
    .transform((val) => val.toLowerCase()),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),

});
