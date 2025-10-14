import { z } from "zod";

export const UserRegSchema = z.object({
  name: z.string({
    required_error: "name is required!",
  }),
  email: z
    .string({
      required_error: "Valid Email is required!",
    })
    .email(),
  password: z.string().min(6, "Must be at least 6 characters"),
  contactNumber: z.string(),

  address: z.string({
    required_error: "address is required!",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address!"),
  password: z.string().min(6, "Must be at least 6 characters"),
});
