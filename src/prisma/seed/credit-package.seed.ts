import creditPackageRepo from "@/lib/repositories/credit-package.repo";
import { CreditPackageCreateArgs } from "@/generated/prisma/models";

// Prices are in the same currency unit as the plan pricings (about 1,500 per $1).
// Credits follow the plan scale (Starter ~4,300 and Creator/Pro/Business ~8,300 credits per $1):
// Top up is about 6,000 credits per $1 and Buy Credit about 8,300 per $1, rounded
const packages: CreditPackageCreateArgs["data"][] = [
  {
    slug: "top-up-5",
    name: "Top up credit",
    description: "Top up credit will be added to your monthly/yearly plan.",
    type: "TopUp",
    price: 7500,
    noOfCredits: 30000,
    sequence: 1,
  },
  {
    slug: "top-up-10",
    name: "Top up credit",
    description: "Top up credit will be added to your monthly/yearly plan.",
    type: "TopUp",
    price: 15000,
    noOfCredits: 60000,
    sequence: 2,
  },
  {
    slug: "top-up-20",
    name: "Top up credit",
    description: "Top up credit will be added to your monthly/yearly plan.",
    type: "TopUp",
    price: 30000,
    noOfCredits: 120000,
    sequence: 3,
  },
  {
    slug: "buy-credit-120",
    name: "Buy credit",
    description: "Get your one time credit and enjoy all features.",
    type: "BuyCredit",
    price: 180000,
    noOfCredits: 1000000,
    sequence: 1,
  },
  {
    slug: "buy-credit-300",
    name: "Buy credit",
    description: "Get your one time credit and enjoy all features.",
    type: "BuyCredit",
    price: 450000,
    noOfCredits: 2500000,
    sequence: 2,
  },
];

export default async function seedCreditPackages() {
  for (const data of packages) {
    await creditPackageRepo.upsertBySlug(data);
  }
}
