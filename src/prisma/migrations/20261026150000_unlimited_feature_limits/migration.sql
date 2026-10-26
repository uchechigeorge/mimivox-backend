-- Premium voices, images, music, videos and max video length are no longer limited.
-- Credits, words per request and clone voices remain limits. NULL means unlimited.

-- Plan templates
UPDATE "PricingSettings"
SET "noOfPremiumVoices" = NULL,
    "noOfImages" = NULL,
    "noOfMusic" = NULL,
    "noOfVideos" = NULL,
    "maxVideoDurationInSeconds" = NULL,
    "updatedAt" = CURRENT_TIMESTAMP;

UPDATE "PlanSettings"
SET "noOfPremiumVoices" = NULL,
    "noOfImages" = NULL,
    "noOfMusic" = NULL,
    "noOfVideos" = NULL,
    "maxVideoDurationInSeconds" = NULL,
    "updatedAt" = CURRENT_TIMESTAMP;

-- Existing users
UPDATE "Users"
SET "noOfPremiumVoicesAllocated" = NULL,
    "noOfPremiumVoicesLeft" = NULL,
    "noOfImagesAllocated" = NULL,
    "noOfImagesLeft" = NULL,
    "noOfMusicAllocated" = NULL,
    "noOfMusicLeft" = NULL,
    "noOfVideosAllocated" = NULL,
    "noOfVideosLeft" = NULL,
    "maxVideoDurationInSeconds" = NULL;
