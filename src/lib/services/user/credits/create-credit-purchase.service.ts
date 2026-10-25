import { CreateCreditPurchaseDto } from "@/lib/dtos/user/credit.dto";
import creditPackageRepo from "@/lib/repositories/credit-package.repo";
import creditPurchaseRepo from "@/lib/repositories/credit-purchase.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { creditPurchaseReadValidator } from "@/lib/validators/user/credit.validator";
import { getCreditPurchaseMeta } from "./get-credit-purchase.service";

export const createCreditPurchase = async (
  body: CreateCreditPurchaseDto,
  authItems: UserAuthItems,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const creditPackage = await creditPackageRepo.getById(body.packageId);
  if (!creditPackage) throw new BadRequestError("Invalid credit package");

  // Top up credits ride on a paid monthly/yearly plan; buying credit is open to everyone
  let subscriptionId: string | null = null;
  if (creditPackage.type === "TopUp") {
    const subscription = await subscriptionRepo.getByUserIdAndIsActive(userId);
    if (!subscription) {
      throw new BadRequestError(
        "Top up requires an active monthly or yearly subscription",
      );
    }
    subscriptionId = subscription.id;
  }

  const purchase = await creditPurchaseRepo.create({
    user: { connect: { id: user.id } },
    userName: user.fullName,
    creditPackage: { connect: { id: creditPackage.id } },
    packageName: creditPackage.name,
    type: creditPackage.type,
    noOfCredits: creditPackage.noOfCredits,
    amount: creditPackage.price,
    subscriptionId,
  });

  const meta = getCreditPurchaseMeta({
    paymentToken: purchase.paymentToken,
    email: user.email,
    amount: creditPackage.price.toNumber(),
  });

  return [creditPurchaseReadValidator.parse(purchase), meta] as const;
};
