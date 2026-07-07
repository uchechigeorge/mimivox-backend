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
  USER_FORGOT_PASSWORD_EXPIRATION: z.string(),
  USER_FORGOT_PASSWORD_URL: z.string(),
  USER_VERIFY_EMAIL_EXPIRATION: z.string(),
  ADMIN_FORGOT_PASSWORD_EXPIRATION: z.string(),
  ADMIN_FORGOT_PASSWORD_URL: z.string(),
  EMAIL_FROM: z.string(),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASS: z.string(),
  APP_NAME: z.string(),
  SUPPORT_EMAIL: z.string(),
  DASHBOARD_LINK: z.string(),

  GOOGLE_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
  XAI_API_KEY: z.string(),
  SUNO_API_KEY: z.string(),
  SUNO_MUSIC_GENERATE_CALLBACK_URL: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  RESEND_API_KEY: z.string(),

  INIT_ADMIN_EMAIL: z.string().optional(),
  INIT_ADMIN_PASSWORD: z.string().optional(),
  INIT_ADMIN_FIRST_NAME: z.string().optional(),
  INIT_ADMIN_LAST_NAME: z.string().optional(),
  CREDITS_PER_CHARACTER: z.coerce.number(),
  CREDITS_PER_CHARACTER_PREMIUM: z.coerce.number(),
  CREDITS_PER_VOICE_CLONE: z.coerce.number(),
  CREDITS_PER_IMAGE: z.coerce.number(),
  CREDITS_PER_MUSIC: z.coerce.number(),
  CREDITS_PER_VIDEO_PER_SECOND: z.coerce.number(),

  PAYSTACK_API_BASE: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),
  PAYSTACK_IGNORE_WEBHOOK_AUTH: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    return false;
  }, z.boolean()),
  SYNC_PAYSTACK_PRICINGS: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    return false;
  }, z.boolean()),
});

export const env = envSchema.parse(process.env);
