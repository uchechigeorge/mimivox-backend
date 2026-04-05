import z from "zod";

export const loginValidator = z.object({
  email: z.string(),
  password: z.string(),
});

export const registerValidator = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});
