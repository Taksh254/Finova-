import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [org, users, accounts, transactions, customers, invoices, employees, exceptions] = await Promise.all([
    prisma.organization.findMany(),
    prisma.user.count(),
    prisma.account.findMany(),
    prisma.transaction.count(),
    prisma.customer.count(),
    prisma.invoice.count(),
    prisma.employee.count(),
    prisma.exception.count(),
  ]);

  console.log("=== Organization ===");
  console.log(org);
  console.log("\n=== Counts ===");
  console.log({ users, transactions, customers, invoices, employees, exceptions });
  console.log("\n=== Accounts (with balances) ===");
  console.log(accounts);
  console.log("\n=== Sample Transactions (5 most recent) ===");
  console.log(await prisma.transaction.findMany({ take: 5, orderBy: { date: "desc" } }));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
