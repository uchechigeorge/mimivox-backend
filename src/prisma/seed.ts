import { prisma } from "@/lib/db/prisma";
import seedPlans from "./seed/plan.seed";
import seedVoices from "./seed/voice.seed";
import { seedAdmins } from "./seed/admin.seed";

async function main() {
  await seedAdmins();
  await seedPlans();
  await seedVoices();

  console.log("🌱 Seeding completed");
}

main()
  .catch((e) => {
    console.log("❌ Seeding failed");
    console.error(e);
  })
  .finally(async () => {
    console.log("🔌 Disconnecting from database");
    await prisma.$disconnect();
    process.exit();
  });
