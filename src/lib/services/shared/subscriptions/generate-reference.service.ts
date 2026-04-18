import { TransactionClient } from "@/generated/prisma/internal/prismaNamespace";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { generateRandomString } from "@/lib/utils/security.utils";

export const generateReference = async (
  tc?: TransactionClient,
): Promise<string> => {
  let reference = generateRandomString(10, { caseSensitive: true });

  const exists = await subscriptionRepo.getExistsByReference(reference, tc);
  if (exists) {
    return await generateReference(tc);
  }

  return reference;
};
