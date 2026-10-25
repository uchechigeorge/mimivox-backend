import { User } from "@/generated/prisma/client";
import { env } from "@/lib/config/env.config";

// MAX_WORDS_PER_REQUEST, when set, replaces the word limit that comes with the plan
export const getMaxWordsPerRequest = (user: User) =>
  env.MAX_WORDS_PER_REQUEST ?? user.noOfWordsAllowed;
