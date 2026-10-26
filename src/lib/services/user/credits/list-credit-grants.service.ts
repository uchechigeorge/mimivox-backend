import adminActionLogRepo from "@/lib/repositories/admin-action-log.repo";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

// Credits an admin added to the user; the admin's identity stays private
export const listCreditGrants = async (authItems: UserAuthItems) => {
  if (!authItems.userId) throw new UnauthorizedError();

  const logs = await adminActionLogRepo.listCreditsByUserId(authItems.userId);

  return logs.map((log) => ({
    id: log.id,
    type: log.action === "CreditTopUp" ? "TopUp" : "Credit",
    noOfCredits: log.noOfCredits,
    note: log.note,
    createdAt: log.createdAt,
  }));
};
