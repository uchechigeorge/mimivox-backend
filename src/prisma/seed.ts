import seedAdmins from "./seed/admin.seed";
import seedCreditPackages from "./seed/credit-package.seed";
import seedPlans from "./seed/plan.seed";
import seedVoices from "./seed/voice.seed";
import { prisma } from "@/lib/db/prisma";

async function main() {
  await seedAdmins();
  await seedPlans();
  await seedCreditPackages();
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
