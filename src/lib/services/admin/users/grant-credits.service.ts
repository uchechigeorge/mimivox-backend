import { prisma } from "@/lib/db/prisma";
import {
  GrantUserCreditsDto,
  GrantUserCreditsParams,
} from "@/lib/dtos/admin/user.dto";
import adminActionLogRepo from "@/lib/repositories/admin-action-log.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { AdminAuthItems } from "@/lib/types";
import { BadRequestError } from "@/lib/utils/error.util";

// Mirrors a paid credit purchase: "Credit" is permanent, "TopUp" also counts as
// top up credit that expires with the plan period, so it needs an active plan
export const grantUserCredits = async (
  params: GrantUserCreditsParams,
  dto: GrantUserCreditsDto,
  authItems: AdminAuthItems,
) => {
  const user = await userRepo.getById(params.id);
  if (!user) throw new BadRequestError("User not found");

  return await prisma.$transaction(async (tc) => {
    const current = await userRepo.getByIdWithLock(user.id, tc);
    if (!current) throw new BadRequestError("User not found");

    const isTopUp = dto.type === "TopUp";
    if (isTopUp) {
      const hasActiveSubscription =
        await subscriptionRepo.getExistsByUserIdAndIsActive(
          user.id,
          true,
          tc,
        );
      if (!hasActiveSubscription) {
        throw new BadRequestError(
          "Top up requires an active subscription. Use Credit instead.",
        );
      }
    }

    // A null balance means unlimited credits, so there is nothing to add to
    const updated = await userRepo.update(
      user.id,
      {
        noOfCreditsAllocated:
          current.noOfCreditsAllocated == null
            ? null
            : current.noOfCreditsAllocated + dto.noOfCredits,
        noOfCreditsLeft:
          current.noOfCreditsLeft == null
            ? null
            : current.noOfCreditsLeft + dto.noOfCredits,
        ...(isTopUp && {
          noOfTopUpCreditsLeft: current.noOfTopUpCreditsLeft + dto.noOfCredits,
        }),
      },
      tc,
    );

    await adminActionLogRepo.create(
      {
        adminId: authItems.adminId,
        adminName: authItems.adminName,
        userId: user.id,
        userName: user.fullName,
        action: isTopUp ? "CreditTopUp" : "CreditAdded",
        description: `${isTopUp ? "Topped up" : "Added"} ${dto.noOfCredits} credits`,
        noOfCredits: dto.noOfCredits,
        note: dto.note,
      },
      tc,
    );

    return {
      noOfCreditsAllocated: updated.noOfCreditsAllocated,
      noOfCreditsLeft: updated.noOfCreditsLeft,
      noOfTopUpCreditsLeft: updated.noOfTopUpCreditsLeft,
    };
  });
};
