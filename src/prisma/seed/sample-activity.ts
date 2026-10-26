// Optional dev script, not part of `prisma db seed`.
// Adds sample activity (subscription payment, credit purchase, audio, image, music, video)
// for the sample user so the activity pages have rows to show:
//   npx tsx --env-file=.env src/prisma/seed/sample-activity.ts [email]
import { prisma } from "@/lib/db/prisma";

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);

async function main() {
  const email = process.argv[2] || "user@email.com";
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error(`No user with email ${email}. Register it first.`);

  const alreadySeeded = await prisma.image.count({
    where: { userId: user.id, title: { startsWith: "Sample" } },
  });
  if (alreadySeeded) {
    console.log(`Sample activity already exists for ${email}`);
    return;
  }

  const userName = user.fullName ?? email;
  const pricing = await prisma.pricing.findFirst({
    where: { isFree: false },
    orderBy: { sequence: "asc" },
  });
  const creditPackage = await prisma.creditPackage.findFirst({
    orderBy: { sequence: "asc" },
  });
  if (!pricing || !creditPackage) {
    throw new Error("Plans or credit packages are not seeded");
  }

  // Past subscription, inactive so the user's real subscription state is untouched.
  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      userName,
      pricingId: pricing.id,
      pricingName: pricing.name,
      planId: pricing.planId,
      planName: pricing.planName,
      status: "Completed",
      isActive: false,
      startDate: daysAgo(40),
      endDate: daysAgo(10),
      initialAmount: pricing.price,
      paymentVerified: true,
      paymentGateway: "Manual",
    },
  });
  await prisma.subscriptionPayment.create({
    data: {
      subscriptionId: subscription.id,
      subscriptionReference: subscription.reference,
      amount: pricing.price,
      status: "Paid",
      isInitialPayment: true,
      isPaymentVerified: true,
      paymentGateway: "Manual",
      userId: user.id,
      userName,
      paidAt: daysAgo(40),
      currency: "NGN",
      startDate: daysAgo(40),
      endDate: daysAgo(10),
      planId: pricing.planId,
      planName: pricing.planName,
    },
  });

  await prisma.creditPurchase.create({
    data: {
      userId: user.id,
      userName,
      packageId: creditPackage.id,
      packageName: creditPackage.name,
      type: creditPackage.type,
      noOfCredits: creditPackage.noOfCredits,
      amount: creditPackage.price,
      amountPaid: creditPackage.price,
      currency: "NGN",
      status: "Paid",
      paymentVerified: true,
      paymentGateway: "Manual",
      paidAt: daysAgo(20),
      createdAt: daysAgo(20),
    },
  });

  // Audio needs a voice; reuse one if voices were seeded.
  const voice =
    (await prisma.voice.findFirst()) ??
    (await prisma.voice.create({
      data: {
        name: "Sample voice",
        audioServiceType: "Google",
        audioServiceReferenceId: "sample-voice",
      },
    }));
  await prisma.audio.create({
    data: {
      userId: user.id,
      userName,
      content: "Welcome to Mimivox. This is a sample text-to-speech request.",
      voiceId: voice.id,
      voiceName: voice.name,
      audioServiceType: voice.audioServiceType,
      createdAt: daysAgo(15),
    },
  });

  await prisma.image.create({
    data: {
      userId: user.id,
      userName,
      title: "Sample image",
      prompt: "A lighthouse on a cliff at sunset, watercolor style",
      createdAt: daysAgo(8),
    },
  });
  await prisma.music.create({
    data: {
      userId: user.id,
      userName,
      title: "Sample music",
      prompt: "Calm lo-fi beat with soft piano",
      durationInSeconds: 120,
      createdAt: daysAgo(5),
    },
  });
  await prisma.video.create({
    data: {
      userId: user.id,
      userName,
      title: "Sample video",
      prompt: "A drone shot over a green valley at sunrise",
      durationInSeconds: 5,
      createdAt: daysAgo(2),
    },
  });

  console.log(`Created sample activity for ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
