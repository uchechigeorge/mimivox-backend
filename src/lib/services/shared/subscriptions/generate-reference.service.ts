import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { generateRandomString } from "@/lib/utils/security.utils";

export const generateReference = async (): Promise<string> => {
  let reference = generateRandomString(10, { caseSensitive: true });

  const exists = await subscriptionRepo.getExistsByReference(reference);
  if (exists) {
    return await generateReference();
  }

  return reference;
};
