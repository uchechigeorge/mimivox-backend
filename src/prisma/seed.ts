import { prisma } from "@/lib/db/prisma";
import seedPlans from "./seed/plan.seed";

async function main() {
  await seedPlans();

  console.log("🌱 Seeding completed");
  // try {

  // } catch (e) {
  //   console.log("❌ Seeding failed");
  //   console.error(e);
  //   process.exit(1);
  // } finally {
  //   console.log("🔌 Disconnecting from database");
  //   await prisma.$disconnect();
  // }
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
