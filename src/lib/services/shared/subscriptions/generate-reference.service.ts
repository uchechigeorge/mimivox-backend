import { Prisma } from "@/generated/prisma/client";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { generateRandomString } from "@/lib/utils/security.utils";

export const generateReference = async (
  tc?: Prisma.TransactionClient,
): Promise<string> => {
  let reference = generateRandomString(10, { caseSensitive: true });

  const exists = await subscriptionRepo.getExistsByReference(reference, tc);
  if (exists) {
    return await generateReference(tc);
  }

  return reference;
};
