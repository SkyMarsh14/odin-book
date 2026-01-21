import prisma from "../lib/prisma.js";
import { users } from "../config/seedData.js";
async function main() {
  console.log("Running seeding script...");
  await prisma.user.createMany({
    data: users,
  });
  console.log("Database seeded successfully");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1); // Exit code 1 represents failure
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
