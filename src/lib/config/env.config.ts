import { z } from "zod";

const envSchema = z.object({
  HOST: z.string(),
  ALLOWED_ORIGINS: z
    .string()
    .transform((val) => val.split(",").map((item) => item.trim())),
  DATABASE_URL: z.string(),
  JWT_USER_ACCESS_SECRET: z.string(),
  JWT_USER_ACCESS_EXPIRATION: z.string(),
  JWT_ADMIN_ACCESS_SECRET: z.string(),
  JWT_ADMIN_ACCESS_EXPIRATION: z.string(),
  GOOGLE_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
