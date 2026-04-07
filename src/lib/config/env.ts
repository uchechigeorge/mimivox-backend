import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_USER_ACCESS_SECRET: z.string(),
  JWT_USER_ACCESS_EXPIRATION: z.string(),
  JWT_ADMIN_ACCESS_SECRET: z.string(),
  JWT_ADMIN_ACCESS_EXPIRATION: z.string(),
  GOOGLE_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
