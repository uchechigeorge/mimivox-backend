import z from "zod";

export const loginValidator = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const registerValidator = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
