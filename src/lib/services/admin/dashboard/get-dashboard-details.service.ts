import { SubscriptionReadDto } from "@/lib/dtos/admin/subscription.dto";
import { UserReadDto } from "@/lib/dtos/admin/user.dto";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { subscriptionReadDtoValidator } from "@/lib/validators/admin/subscription.validator";
import { userReadDtoValidator } from "@/lib/validators/admin/user.validator";

export const getDashboardDetails = async () => {
  const [recentUsersData] = await userRepo.query({
    pageSize: 20,
    sortBy: "createdAt",
  });
  const [recentSubscriptionsData] = await subscriptionRepo.query({
    pageSize: 20,
    sortBy: "createdAt",
    isActive: true,
  });

  const recentUsers: UserReadDto[] = recentUsersData.map((e) =>
    userReadDtoValidator.parse(e),
  );
  const recentSubscriptions: SubscriptionReadDto[] =
    recentSubscriptionsData.map((e) => subscriptionReadDtoValidator.parse(e));

  const response = {
    recentUsers,
    recentSubscriptions,
  };

  return response;
};
