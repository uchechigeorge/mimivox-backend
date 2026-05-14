import { SubscriptionReadDto } from "@/lib/dtos/admin/subscription.dto";
import { UserReadDto } from "@/lib/dtos/admin/user.dto";
import audioRepo from "@/lib/repositories/audio.repo";
import imageRepo from "@/lib/repositories/image.repo";
import musicRepo from "@/lib/repositories/music.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import videoRepo from "@/lib/repositories/video.repo";
import voiceRepo from "@/lib/repositories/voice.repo";
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

  const generationsSummary = {
    noOfAudiosGenerated: await audioRepo.getCount(),
    noOfPremiumTTSGenerated: await audioRepo.getCount({
      voice: { audioServiceType: "ElevenLabs" },
    }),
    noOfClonedVoicesGenerated: await voiceRepo.getCount({
      type: "Cloned",
    }),
    noOfImagesGenerated: await imageRepo.getCount(),
    noOfMusicsGenerated: await musicRepo.getCount(),
    noOfVideosGenerated: await videoRepo.getCount(),
  };
  const response = {
    recentUsers,
    recentSubscriptions,
    generationsSummary,
  };

  return response;
};
