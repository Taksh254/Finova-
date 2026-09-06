/**
 * FINOVA Seed Data
 * Realistic demo data for Arcova Technologies Pvt. Ltd.
 *
 * Financial year: April 2025 - March 2026
 * Current period (for dashboard): August 2025
 * Previous period: July 2025
 *
 * All dashboard numbers are derived from this seed data.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: create Date from YYYY-MM-DD
function d(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00.000Z");
}

async function main() {
  console.log("🌱 Starting FINOVA seed...");

  // Clear existing data (respecting FK order)
  await prisma.auditLog.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.agentActivity.deleteMany();
  await prisma.reconciliationMatch.deleteMany();
  await prisma.reconciliationRun.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.exception.deleteMany();
  await prisma.cashFlowEntry.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.payrollRecord.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.salaryStructure.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log("✓ Cleared existing data");

  // ============================================================
  // ORGANIZATION
  // ============================================================
  const organization = await prisma.organization.create({
    data: {
      id: "comp_arcova",
      name: "arcova-technologies",
      displayName: "Arcova Technologies Pvt. Ltd.",
      currency: "INR",
      fiscalYearStart: 4,
      industry: "SaaS / B2B Software",
    },
  });

  console.log("✓ Created organization:", organization.displayName);

  // ============================================================
  // USERS
  // Organization membership/role now lives directly on User
  // (organizationId + role) - no separate membership table.
  // ============================================================
  await prisma.user.createMany({
    data: [
      { id: "user_cfo", name: "Priya Sharma", email: "priya.sharma@arcova.in", organizationId: organization.id, role: "OWNER" },
      { id: "user_controller", name: "Rohan Mehta", email: "rohan.mehta@arcova.in", organizationId: organization.id, role: "ADMIN" },
      { id: "user_analyst", name: "Ananya Nair", email: "ananya.nair@arcova.in", organizationId: organization.id, role: "ACCOUNTANT" },
    ],
  });

  console.log("✓ Created 3 users");

  // ============================================================
  // ACCOUNTS
  // Balances sum to the August closing cash position (₹2,05,67,000)
  // computed from the cash flow entries below.
  // ============================================================
  const [acctHdfc, acctIcici, acctKotak] = await Promise.all([
    prisma.account.create({
      data: { id: "acct_hdfc", organizationId: organization.id, name: "HDFC Business", type: "BANK", balance: 14500000, status: "ACTIVE" },
    }),
    prisma.account.create({
      data: { id: "acct_icici", organizationId: organization.id, name: "ICICI Current", type: "BANK", balance: 4500000, status: "ACTIVE" },
    }),
    prisma.account.create({
      data: { id: "acct_kotak", organizationId: organization.id, name: "Kotak Savings", type: "BANK", balance: 1567000, status: "ACTIVE" },
    }),
  ]);

  console.log("✓ Created 3 accounts (HDFC Business, ICICI Current, Kotak Savings)");

  // ============================================================
  // CUSTOMERS (receivable-side clients)
  // ============================================================
  const customerSeed = [
    { id: "cust_tata", name: "Tata Digital Solutions", email: "accounts.payable@tatadigital.in", companyName: "Tata Digital Solutions Ltd." },
    { id: "cust_wipro", name: "Wipro Tech", email: "vendor.finance@wiprotech.in", companyName: "Wipro Technologies Ltd." },
    { id: "cust_bajaj", name: "Bajaj Finserv", email: "ap@bajajfinserv.in", companyName: "Bajaj Finserv Ltd." },
    { id: "cust_mahindra", name: "Mahindra Finance", email: "finance.ops@mahindrafinance.in", companyName: "Mahindra & Mahindra Financial Services" },
    { id: "cust_finedge", name: "FinEdge Analytics", email: "billing@finedgeanalytics.in", companyName: "FinEdge Analytics Pvt. Ltd." },
    { id: "cust_hdfcins", name: "HDFC Insurance", email: "vendors@hdfclife.in", companyName: "HDFC Life Insurance Co." },
    { id: "cust_reliance", name: "Reliance Retail Tech", email: "ap.retailtech@ril.com", companyName: "Reliance Retail Technologies" },
    { id: "cust_indiamart", name: "IndiaMart Digital", email: "finance@indiamartdigital.in", companyName: "IndiaMart Digital Services" },
  ];
  await prisma.customer.createMany({
    data: customerSeed.map((c) => ({ ...c, organizationId: organization.id })),
  });

  console.log(`✓ Created ${customerSeed.length} customers`);

  // ============================================================
  // TRANSACTIONS
  // Period: April - September 2025
  //
  // August 2025 (current period):  Revenue: 42,80,000  Expenses: 33,15,000
  // July 2025 (previous period):   Revenue: 38,10,000  Expenses: 31,80,000
  // ============================================================

  const transactions: Array<{
    date: Date;
    type: string;
    category: string;
    subCategory?: string;
    vendor?: string;
    amount: number;
    description: string;
    reference?: string;
    status: string;
    organizationId: string;
    accountId: string;
  }> = [];

  // ---- APRIL 2025 Revenue ----
  transactions.push(
    { date: d("2025-04-05"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1250000, description: "Enterprise license - Tata Digital Solutions", reference: "REV-2025-0401", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-04-12"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 875000, description: "Monthly SaaS - Q1 bundle (18 clients)", reference: "REV-2025-0402", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-04-18"), type: "REVENUE", category: "Services", subCategory: "Implementation", amount: 420000, description: "Implementation services - Reliance Retail", reference: "REV-2025-0403", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-04-25"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 650000, description: "Annual plan renewals", reference: "REV-2025-0404", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
  );

  // ---- APRIL 2025 Expenses ----
  transactions.push(
    { date: d("2025-04-01"), type: "EXPENSE", category: "Payroll", vendor: "Internal Payroll", amount: 1850000, description: "April payroll - 42 employees", reference: "PAY-2025-04", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-04-03"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", vendor: "Amazon Web Services", amount: 285000, description: "AWS cloud infrastructure - April", reference: "AWS-2025-04", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-04-07"), type: "EXPENSE", category: "Software", vendor: "Slack / Notion / Figma / Mixpanel", amount: 145000, description: "SaaS tools - Slack, Notion, Figma, Mixpanel", reference: "SFT-2025-04", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-04-15"), type: "EXPENSE", category: "Marketing", vendor: "Google Ads / LinkedIn", amount: 320000, description: "Digital marketing - Google Ads, LinkedIn", reference: "MKT-2025-04", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-04-20"), type: "EXPENSE", category: "Office", vendor: "DLF CyberCity", amount: 95000, description: "Office rent + utilities - April", reference: "OFC-2025-04", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
  );

  // ---- MAY 2025 Revenue ----
  transactions.push(
    { date: d("2025-05-02"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 980000, description: "Enterprise license - HDFC Insurance", reference: "REV-2025-0501", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-05-10"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 920000, description: "Monthly SaaS subscriptions (21 clients)", reference: "REV-2025-0502", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-05-20"), type: "REVENUE", category: "Services", subCategory: "Support", amount: 180000, description: "Premium support contracts - Q1", reference: "REV-2025-0503", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-05-28"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 740000, description: "New MRR additions - 5 new clients", reference: "REV-2025-0504", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
  );

  // ---- MAY 2025 Expenses ----
  transactions.push(
    { date: d("2025-05-01"), type: "EXPENSE", category: "Payroll", vendor: "Internal Payroll", amount: 1920000, description: "May payroll - 44 employees (2 new hires)", reference: "PAY-2025-05", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-05-03"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", vendor: "AWS / GCP", amount: 298000, description: "AWS + GCP infrastructure - May", reference: "INF-2025-05", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-05-08"), type: "EXPENSE", category: "Software", vendor: "SaaS Tools", amount: 162000, description: "SaaS tools renewal + new subscriptions", reference: "SFT-2025-05", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-05-15"), type: "EXPENSE", category: "Marketing", vendor: "SEO / Paid Campaigns", amount: 350000, description: "Content marketing + SEO + paid campaigns", reference: "MKT-2025-05", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-05-25"), type: "EXPENSE", category: "Travel", vendor: "Corporate Travel Desk", amount: 125000, description: "Sales team travel - Bangalore + Mumbai", reference: "TRV-2025-05", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
  );

  // ---- JUNE 2025 Revenue ----
  transactions.push(
    { date: d("2025-06-05"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1580000, description: "Enterprise license - Infosys BPO", reference: "REV-2025-0601", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-06-12"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1050000, description: "Monthly SaaS - 24 active accounts", reference: "REV-2025-0602", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-06-22"), type: "REVENUE", category: "Services", subCategory: "Consulting", amount: 360000, description: "Financial module consulting - 3 clients", reference: "REV-2025-0603", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
  );

  // ---- JUNE 2025 Expenses ----
  transactions.push(
    { date: d("2025-06-01"), type: "EXPENSE", category: "Payroll", vendor: "Internal Payroll", amount: 2050000, description: "June payroll - 46 employees", reference: "PAY-2025-06", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-06-04"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", vendor: "Amazon Web Services", amount: 315000, description: "AWS infrastructure - scale up for new clients", reference: "INF-2025-06", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-06-10"), type: "EXPENSE", category: "Software", vendor: "Datadog", amount: 177000, description: "Additional software licenses + Datadog", reference: "SFT-2025-06", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-06-18"), type: "EXPENSE", category: "Legal", vendor: "LegalEdge Associates", amount: 245000, description: "Legal retainer + contract reviews", reference: "LGL-2025-06", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
    { date: d("2025-06-28"), type: "EXPENSE", category: "Office", vendor: "DLF CyberCity", amount: 98000, description: "Office rent + utilities + supplies", reference: "OFC-2025-06", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
  );

  // ---- JULY 2025 (Previous Period) Revenue: 38,10,000 ----
  transactions.push(
    { date: d("2025-07-03"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1420000, description: "Enterprise license renewal - Wipro Tech", reference: "REV-2025-0701", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-07-10"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1180000, description: "Monthly SaaS - 27 accounts", reference: "REV-2025-0702", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-07-18"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 620000, description: "Mid-cycle upsell - 4 accounts upgraded", reference: "REV-2025-0703", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-07-25"), type: "REVENUE", category: "Services", subCategory: "Implementation", amount: 590000, description: "Implementation + onboarding - Bajaj Finserv", reference: "REV-2025-0704", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
  );

  // ---- JULY 2025 Expenses: 31,80,000 ----
  transactions.push(
    { date: d("2025-07-01"), type: "EXPENSE", category: "Payroll", vendor: "Internal Payroll", amount: 2050000, description: "July payroll - 46 employees", reference: "PAY-2025-07", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-07-04"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", vendor: "AWS / Cloudflare", amount: 328000, description: "AWS + Cloudflare infrastructure - July", reference: "INF-2025-07", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-07-09"), type: "EXPENSE", category: "Software", vendor: "SaaS Tools", amount: 158000, description: "Monthly SaaS tools", reference: "SFT-2025-07", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-07-15"), type: "EXPENSE", category: "Marketing", vendor: "SaaSBoomi", amount: 380000, description: "SaaSBoomi event sponsorship + digital campaigns", reference: "MKT-2025-07", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-07-22"), type: "EXPENSE", category: "Office", vendor: "DLF CyberCity", amount: 98000, description: "Office expenses - July", reference: "OFC-2025-07", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
    { date: d("2025-07-28"), type: "EXPENSE", category: "Travel", vendor: "Corporate Travel Desk", amount: 166000, description: "Enterprise sales team - Delhi + Hyderabad", reference: "TRV-2025-07", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
  );

  // ---- AUGUST 2025 (Current Period) Revenue: 42,80,000 ----
  transactions.push(
    { date: d("2025-08-04"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1850000, description: "New enterprise deal - Mahindra Finance", reference: "REV-2025-0801", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-08-08"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1320000, description: "Monthly SaaS - 31 active accounts", reference: "REV-2025-0802", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-08-15"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 720000, description: "Mid-market deal - FinEdge Analytics", reference: "REV-2025-0803", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-08-20"), type: "REVENUE", category: "Services", subCategory: "Implementation", amount: 390000, description: "Implementation - Mahindra Finance phase 1", reference: "REV-2025-0804", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
  );

  // ---- AUGUST 2025 Expenses: 33,15,000 ----
  transactions.push(
    { date: d("2025-08-01"), type: "EXPENSE", category: "Payroll", vendor: "Internal Payroll", amount: 2120000, description: "August payroll - 48 employees (2 new hires)", reference: "PAY-2025-08", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-08-05"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", vendor: "Amazon Web Services", amount: 342000, description: "AWS infrastructure - capacity expansion", reference: "INF-2025-08", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-08-07"), type: "EXPENSE", category: "Software", vendor: "SaaS Tools", amount: 193000, description: "Software subscriptions (22% increase - new tools)", reference: "SFT-2025-08", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-08-12"), type: "EXPENSE", category: "Marketing", vendor: "Product Hunt", amount: 420000, description: "Product Hunt launch + performance campaigns", reference: "MKT-2025-08", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-08-18"), type: "EXPENSE", category: "Office", vendor: "DLF CyberCity", amount: 100000, description: "Office rent + utilities - August", reference: "OFC-2025-08", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
    { date: d("2025-08-22"), type: "EXPENSE", category: "Legal", vendor: "LegalEdge Associates", amount: 140000, description: "Enterprise contract legal review", reference: "LGL-2025-08", status: "CLEARED", organizationId: organization.id, accountId: acctKotak.id },
  );

  // ---- SEPTEMBER 2025 (month-to-date, for Recent Transactions realism) ----
  transactions.push(
    { date: d("2025-09-01"), type: "EXPENSE", category: "Office", vendor: "DLF CyberCity", amount: 60000, description: "Office Rent — DLF CyberCity", reference: "OFC-2025-09", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
    { date: d("2025-09-02"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1420000, description: "Client Payment — Wipro Technologies (enterprise renewal)", reference: "REV-2025-0901", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-09-02"), type: "EXPENSE", category: "Software", vendor: "Razorpay Technologies", amount: 2480, description: "Razorpay Fees", reference: "PMT-2025-0901", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-09-04"), type: "EXPENSE", category: "Software", vendor: "Workday India", amount: 285000, description: "HDFC Current Account payout to Workday India", reference: "PAY-2025-0902", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-09-05"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", vendor: "Amazon Web Services", amount: 42800, description: "AWS Cloud Services", reference: "INF-2025-09", status: "CLEARED", organizationId: organization.id, accountId: acctHdfc.id },
    { date: d("2025-09-05"), type: "EXPENSE", category: "Software", vendor: "Google Workspace", amount: 10400, description: "Google Workspace", reference: "SFT-2025-09", status: "CLEARED", organizationId: organization.id, accountId: acctIcici.id },
  );

  await prisma.transaction.createMany({ data: transactions });
  console.log(`✓ Created ${transactions.length} transactions`);

  // ============================================================
  // INVOICES (+ line items)
  // Accounts Receivable (RECEIVABLE): unpaid client invoices
  // Accounts Payable (PAYABLE): unpaid vendor invoices
  //
  // NOTE: INV-AR-004 (Mahindra Finance, ₹18,50,000) and INV-AR-005
  // (FinEdge Analytics, ₹7,20,000) intentionally line up amount-for-amount
  // with the Aug revenue transactions above (REV-2025-0801 / REV-2025-0803)
  // so the Reconciliation Agent has real, high-confidence matches to find
  // live during the demo.
  // ============================================================
  const invoiceSeed: Array<{
    invoiceNumber: string;
    type: string;
    vendorClient: string;
    customerId?: string;
    amount: number;
    issueDate: Date;
    dueDate: Date;
    paidDate?: Date;
    status: string;
    description: string;
    organizationId: string;
  }> = [
    // Receivables - PAID
    { invoiceNumber: "INV-AR-001", type: "RECEIVABLE", vendorClient: "Tata Digital Solutions", customerId: "cust_tata", amount: 1250000, issueDate: d("2025-07-01"), dueDate: d("2025-07-31"), paidDate: d("2025-07-28"), status: "PAID", description: "Enterprise license Q2", organizationId: organization.id },
    { invoiceNumber: "INV-AR-002", type: "RECEIVABLE", vendorClient: "Wipro Tech", customerId: "cust_wipro", amount: 1420000, issueDate: d("2025-07-15"), dueDate: d("2025-08-14"), paidDate: d("2025-08-10"), status: "PAID", description: "Enterprise license renewal Jul", organizationId: organization.id },
    { invoiceNumber: "INV-AR-003", type: "RECEIVABLE", vendorClient: "Bajaj Finserv", customerId: "cust_bajaj", amount: 590000, issueDate: d("2025-07-25"), dueDate: d("2025-08-24"), paidDate: d("2025-08-20"), status: "PAID", description: "Implementation services Jul", organizationId: organization.id },

    // Receivables - PENDING (outstanding AR) - live reconciliation candidates
    { invoiceNumber: "INV-AR-004", type: "RECEIVABLE", vendorClient: "Mahindra Finance", customerId: "cust_mahindra", amount: 1850000, issueDate: d("2025-08-04"), dueDate: d("2025-09-03"), status: "PENDING", description: "Enterprise license - new deal Aug", organizationId: organization.id },
    { invoiceNumber: "INV-AR-005", type: "RECEIVABLE", vendorClient: "FinEdge Analytics", customerId: "cust_finedge", amount: 720000, issueDate: d("2025-08-15"), dueDate: d("2025-09-14"), status: "PENDING", description: "Mid-market license Aug", organizationId: organization.id },
    { invoiceNumber: "INV-AR-006", type: "RECEIVABLE", vendorClient: "HDFC Insurance", customerId: "cust_hdfcins", amount: 490000, issueDate: d("2025-08-20"), dueDate: d("2025-09-19"), status: "PENDING", description: "Monthly SaaS subscription", organizationId: organization.id },

    // Receivables - OVERDUE
    { invoiceNumber: "INV-AR-007", type: "RECEIVABLE", vendorClient: "Reliance Retail Tech", customerId: "cust_reliance", amount: 380000, issueDate: d("2025-07-10"), dueDate: d("2025-08-09"), status: "OVERDUE", description: "Implementation Q2 - payment pending", organizationId: organization.id },
    { invoiceNumber: "INV-AR-008", type: "RECEIVABLE", vendorClient: "IndiaMart Digital", customerId: "cust_indiamart", amount: 210000, issueDate: d("2025-07-20"), dueDate: d("2025-08-19"), status: "OVERDUE", description: "SaaS subscription Jul - unpaid", organizationId: organization.id },

    // Payables - PAID
    { invoiceNumber: "INV-AP-001", type: "PAYABLE", vendorClient: "Amazon Web Services", amount: 342000, issueDate: d("2025-08-01"), dueDate: d("2025-08-15"), paidDate: d("2025-08-14"), status: "PAID", description: "AWS infrastructure Aug", organizationId: organization.id },
    { invoiceNumber: "INV-AP-002", type: "PAYABLE", vendorClient: "Workday India", amount: 285000, issueDate: d("2025-07-31"), dueDate: d("2025-08-30"), paidDate: d("2025-08-28"), status: "PAID", description: "HR system annual license", organizationId: organization.id },

    // Payables - PENDING (outstanding AP)
    { invoiceNumber: "INV-AP-003", type: "PAYABLE", vendorClient: "Salesforce India", amount: 520000, issueDate: d("2025-08-15"), dueDate: d("2025-09-10"), status: "PENDING", description: "CRM annual renewal", organizationId: organization.id },
    { invoiceNumber: "INV-AP-004", type: "PAYABLE", vendorClient: "Razorpay Technologies", amount: 95000, issueDate: d("2025-08-25"), dueDate: d("2025-09-07"), status: "PENDING", description: "Payment gateway fees Aug", organizationId: organization.id },
    { invoiceNumber: "INV-AP-005", type: "PAYABLE", vendorClient: "Nitor Digital", amount: 380000, issueDate: d("2025-08-20"), dueDate: d("2025-09-12"), status: "PENDING", description: "UI/UX design contract", organizationId: organization.id },
    { invoiceNumber: "INV-AP-006", type: "PAYABLE", vendorClient: "LegalEdge Associates", amount: 140000, issueDate: d("2025-08-22"), dueDate: d("2025-09-05"), status: "PENDING", description: "Legal services Aug", organizationId: organization.id },
    // INV-AP-004 due Sep 7 + INV-AP-006 due Sep 5 -> ₹2,35,000 due within 7 days
  ];

  for (const inv of invoiceSeed) {
    const created = await prisma.invoice.create({ data: inv as never });
    await prisma.invoiceItem.create({
      data: {
        invoiceId: created.id,
        description: inv.description || inv.vendorClient,
        quantity: 1,
        unitPrice: inv.amount,
        taxRate: 0,
        total: inv.amount,
      },
    });
    if (inv.status === "PAID" && inv.paidDate) {
      await prisma.payment.create({
        data: {
          organizationId: organization.id,
          invoiceId: created.id,
          amount: inv.amount,
          paymentDate: inv.paidDate,
          method: "BANK_TRANSFER",
          reference: `${inv.invoiceNumber}-SETTLEMENT`,
        },
      });
    }
  }

  console.log(`✓ Created ${invoiceSeed.length} invoices (with line items + payments for paid invoices)`);

  // ============================================================
  // EMPLOYEES + SALARY STRUCTURES + ATTENDANCE + LEAVE
  // A representative payroll roster the new Payroll Agent operates on.
  // (The legacy PayrollRecord rows below are organization-wide historical
  // aggregates from before per-employee payroll existed - both coexist.)
  // ============================================================
  function weekdaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(year, month - 1, day));
      const dow = date.getUTCDay();
      if (dow !== 0 && dow !== 6) days.push(date);
    }
    return days;
  }

  const employeeSeed = [
    { id: "emp_011", employeeCode: "EMP-011", name: "Ananth Rao", email: "ananth.rao@arcova.in", department: "Engineering", designation: "Senior Software Engineer", hireDate: d("2023-02-10"), baseSalary: 145000, allowances: { HRA: 29000, Transport: 3000 }, deductions: { PF: 1800, ProfessionalTax: 200 } },
    { id: "emp_023", employeeCode: "EMP-023", name: "Sneha Kulkarni", email: "sneha.kulkarni@arcova.in", department: "Sales", designation: "Account Executive", hireDate: d("2023-07-01"), baseSalary: 95000, allowances: { HRA: 19000, Transport: 2500 }, deductions: { PF: 1800, ProfessionalTax: 200 } },
    { id: "emp_034", employeeCode: "EMP-034", name: "Vikram Singh", email: "vikram.singh@arcova.in", department: "Engineering", designation: "Engineering Manager", hireDate: d("2022-11-15"), baseSalary: 210000, allowances: { HRA: 42000, Transport: 3000 }, deductions: { PF: 1800, ProfessionalTax: 200 } },
    { id: "emp_041", employeeCode: "EMP-041", name: "Meera Iyer", email: "meera.iyer@arcova.in", department: "Marketing", designation: "Marketing Lead", hireDate: d("2024-01-08"), baseSalary: 120000, allowances: { HRA: 24000, Transport: 2500 }, deductions: { PF: 1800, ProfessionalTax: 200 } },
    { id: "emp_052", employeeCode: "EMP-052", name: "Arjun Nair", email: "arjun.nair@arcova.in", department: "Operations", designation: "Operations Executive", hireDate: d("2024-05-20"), baseSalary: 72000, allowances: { HRA: 14400, Transport: 2000 }, deductions: { PF: 1800, ProfessionalTax: 200 } },
    { id: "emp_058", employeeCode: "EMP-058", name: "Divya Menon", email: "divya.menon@arcova.in", department: "Support", designation: "Support Associate", hireDate: d("2025-08-01"), baseSalary: 65000, allowances: { HRA: 13000, Transport: 2000 }, deductions: { PF: 1800, ProfessionalTax: 200 } },
  ];

  // EMP-047 (Rahul Verma) intentionally carries two salary structure versions
  // so August payroll reflects the unapproved 35% raise the seeded
  // "Salary anomaly detected" Exception (above) is describing.
  const rahulId = "emp_047";

  await prisma.employee.createMany({
    data: [
      ...employeeSeed.map((e) => ({
        id: e.id,
        organizationId: organization.id,
        employeeCode: e.employeeCode,
        name: e.name,
        email: e.email,
        department: e.department,
        designation: e.designation,
        employmentType: "FULL_TIME",
        status: "ACTIVE",
        hireDate: e.hireDate,
      })),
      {
        id: rahulId,
        organizationId: organization.id,
        employeeCode: "EMP-047",
        name: "Rahul Verma",
        email: "rahul.verma@arcova.in",
        department: "Finance",
        designation: "Financial Analyst",
        employmentType: "FULL_TIME",
        status: "ACTIVE",
        hireDate: d("2023-09-01"),
      },
    ],
  });

  await prisma.salaryStructure.createMany({
    data: [
      ...employeeSeed.map((e) => ({
        employeeId: e.id,
        effectiveFrom: e.hireDate,
        baseSalary: e.baseSalary,
        allowances: e.allowances,
        deductions: e.deductions,
        currency: "INR",
      })),
      {
        employeeId: rahulId,
        effectiveFrom: d("2023-09-01"),
        effectiveTo: d("2025-07-31"),
        baseSalary: 88000,
        allowances: { HRA: 17600, Transport: 2500 },
        deductions: { PF: 1800, ProfessionalTax: 200 },
        currency: "INR",
      },
      {
        // Unapproved raise effective August 2025 - this is what the seeded
        // PAYROLL exception is flagging.
        employeeId: rahulId,
        effectiveFrom: d("2025-08-01"),
        baseSalary: 118800,
        allowances: { HRA: 23760, Transport: 2500 },
        deductions: { PF: 1800, ProfessionalTax: 200 },
        currency: "INR",
      },
    ],
  });

  const allEmployeeIds = [...employeeSeed.map((e) => e.id), rahulId];
  const attendanceRows: Array<{ employeeId: string; date: Date; status: string }> = [];
  const leaveRows: Array<{ employeeId: string; type: string; startDate: Date; endDate: Date; status: string; reason: string }> = [];

  for (const [year, month] of [[2025, 8], [2025, 9]] as const) {
    const weekdays = weekdaysInMonth(year, month);
    for (const empId of allEmployeeIds) {
      // Divya Menon only joined 2025-08-01; skip days before hire for other
      // future employees automatically since weekdays start at day 1 anyway.
      for (const day of weekdays) {
        if (empId === "emp_058" && day < d("2025-08-01")) continue;
        attendanceRows.push({ employeeId: empId, date: day, status: "PRESENT" });
      }
    }
  }

  // A handful of realistic leave/absence exceptions layered on top of the
  // all-PRESENT baseline above.
  const leaveAdjustments: Array<{ employeeId: string; dates: Date[]; type: string; reason: string }> = [
    { employeeId: "emp_023", dates: [d("2025-08-11"), d("2025-08-12")], type: "CASUAL", reason: "Personal travel" },
    { employeeId: "emp_034", dates: [d("2025-08-25")], type: "SICK", reason: "Fever" },
    { employeeId: "emp_052", dates: [d("2025-09-02"), d("2025-09-03"), d("2025-09-04")], type: "EARNED", reason: "Family function" },
  ];

  for (const adj of leaveAdjustments) {
    for (const date of adj.dates) {
      const row = attendanceRows.find((r) => r.employeeId === adj.employeeId && r.date.getTime() === date.getTime());
      if (row) row.status = "ON_LEAVE";
    }
    leaveRows.push({
      employeeId: adj.employeeId,
      type: adj.type,
      startDate: adj.dates[0],
      endDate: adj.dates[adj.dates.length - 1],
      status: "APPROVED",
      reason: adj.reason,
    });
  }

  await prisma.attendance.createMany({ data: attendanceRows });
  await prisma.leave.createMany({ data: leaveRows });

  console.log(`✓ Created ${employeeSeed.length + 1} employees with salary structures, ${attendanceRows.length} attendance records, ${leaveRows.length} leave records`);

  // ============================================================
  // PAYROLL RECORDS
  // ============================================================
  const payrollRecords = [
    { period: "2025-04", periodStart: d("2025-04-01"), periodEnd: d("2025-04-30"), totalAmount: 1850000, headcount: 42, status: "PAID", exceptions: 0, organizationId: organization.id },
    { period: "2025-05", periodStart: d("2025-05-01"), periodEnd: d("2025-05-31"), totalAmount: 1920000, headcount: 44, status: "PAID", exceptions: 0, organizationId: organization.id },
    { period: "2025-06", periodStart: d("2025-06-01"), periodEnd: d("2025-06-30"), totalAmount: 2050000, headcount: 46, status: "PAID", exceptions: 0, organizationId: organization.id },
    { period: "2025-07", periodStart: d("2025-07-01"), periodEnd: d("2025-07-31"), totalAmount: 2050000, headcount: 46, status: "PAID", exceptions: 1, organizationId: organization.id },
    { period: "2025-08", periodStart: d("2025-08-01"), periodEnd: d("2025-08-31"), totalAmount: 2120000, headcount: 48, status: "PAID", exceptions: 1, organizationId: organization.id },
    { period: "2025-09", periodStart: d("2025-09-01"), periodEnd: d("2025-09-30"), totalAmount: 2180000, headcount: 49, status: "PENDING", exceptions: 0, organizationId: organization.id },
  ];

  await prisma.payrollRecord.createMany({ data: payrollRecords });
  console.log(`✓ Created ${payrollRecords.length} payroll records`);

  // ============================================================
  // CASH FLOW ENTRIES
  // Opening balance (April 1, 2025): ₹1,85,00,000 (1.85 Cr)
  // Monthly entries with running balance
  // ============================================================
  const cashFlowEntries: Array<{
    date: Date;
    period: string;
    inflow: number;
    outflow: number;
    netFlow: number;
    balance: number;
    organizationId: string;
  }> = [];

  const monthlyData = [
    { period: "2025-04", inflow: 3195000, outflow: 2793000 },
    { period: "2025-05", inflow: 2820000, outflow: 2855000 },
    { period: "2025-06", inflow: 2990000, outflow: 2885000 },
    { period: "2025-07", inflow: 3810000, outflow: 3180000 },
    { period: "2025-08", inflow: 4280000, outflow: 3315000 },
  ];

  let runningBalance = 18500000; // ₹1.85 Cr opening balance

  for (const month of monthlyData) {
    const [year, mo] = month.period.split("-").map(Number);
    const netFlow = month.inflow - month.outflow;
    runningBalance += netFlow;

    cashFlowEntries.push({
      date: new Date(`${year}-${String(mo).padStart(2, "0")}-28T00:00:00.000Z`),
      period: month.period,
      inflow: month.inflow,
      outflow: month.outflow,
      netFlow,
      balance: runningBalance,
      organizationId: organization.id,
    });
  }

  await prisma.cashFlowEntry.createMany({ data: cashFlowEntries });
  console.log(`✓ Created ${cashFlowEntries.length} cash flow entries (closing balance ₹${runningBalance.toLocaleString("en-IN")})`);

  // ============================================================
  // EXCEPTIONS
  // ============================================================
  const exceptions = await Promise.all([
    prisma.exception.create({ data: { type: "RECONCILIATION", severity: "HIGH", title: "Bank statement mismatch - HDFC Current Account", description: "3 transactions in August totalling ₹47,200 appear in bank statement but not in ledger. Possible duplicate entries or timing differences.", status: "OPEN", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "RECONCILIATION", severity: "MEDIUM", title: "ICICI account reconciliation gap", description: "Closing balance differs by ₹8,500. Investigation required.", status: "IN_REVIEW", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "RECONCILIATION", severity: "LOW", title: "Kotak savings account minor discrepancy", description: "₹1,200 unmatched interest entry.", status: "OPEN", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "INVOICE", severity: "HIGH", title: "Duplicate invoice detected - AWS", description: "INV-AP-DUP-001 appears to be a duplicate of INV-AP-001 for the same billing period. Hold payment pending review.", status: "OPEN", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "INVOICE", severity: "MEDIUM", title: "Invoice amount mismatch - Nitor Digital", description: "Invoice INV-AP-005 for ₹3,80,000 exceeds PO amount of ₹3,20,000 by ₹60,000. Approval required.", status: "OPEN", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "PAYROLL", severity: "HIGH", title: "Salary anomaly detected - Employee EMP-047", description: "August payroll for employee EMP-047 (Rahul Verma) shows 35% increase vs July without matching HR approval record.", status: "OPEN", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "INVOICE", severity: "LOW", title: "Overdue receivables - IndiaMart Digital", description: "Invoice INV-AR-008 (₹2,10,000) is 17 days overdue. Follow-up required.", status: "IN_REVIEW", organizationId: organization.id } }),
    prisma.exception.create({ data: { type: "RECONCILIATION", severity: "MEDIUM", title: "Unmatched payment - Vendor transfer", description: "₹85,000 bank transfer on Aug 28 has no matching invoice or PO. Requires categorization.", status: "OPEN", organizationId: organization.id } }),
  ]);

  console.log(`✓ Created ${exceptions.length} exceptions`);

  // ============================================================
  // DOCUMENTS (foundation for RAG)
  // ============================================================
  await prisma.document.createMany({
    data: [
      { name: "Financial Policy Manual v2.3", type: "POLICY", content: "This document outlines Arcova Technologies financial policies including expense limits, approval thresholds, and reimbursement procedures.", metadata: JSON.stringify({ tags: ["policy", "expenses", "approvals"], version: "2.3", author: "CFO Office" }), organizationId: organization.id },
      { name: "Procurement Policy 2025", type: "POLICY", content: "Vendor onboarding, PO requirements, and payment terms. Invoices above ₹5L require dual approval.", metadata: JSON.stringify({ tags: ["procurement", "vendor", "PO"], version: "1.1", author: "Finance Team" }), organizationId: organization.id },
      { name: "Board Report Q1 FY26", type: "REPORT", metadata: JSON.stringify({ tags: ["board", "Q1", "FY26"], quarter: "Q1" }), organizationId: organization.id },
    ],
  });

  console.log("✓ Created 3 documents");

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Organization: Arcova Technologies Pvt. Ltd.");
  console.log("August 2025 Revenue:   ₹42,80,000");
  console.log("August 2025 Expenses:  ₹33,15,000");
  console.log("July 2025 Revenue:     ₹38,10,000");
  console.log("July 2025 Expenses:    ₹31,80,000");
  console.log(`Cash closing balance:  ₹${runningBalance.toLocaleString("en-IN")}`);
  console.log("Open Exceptions:       8");
  console.log("Live reconciliation candidates: Mahindra Finance (₹18.5L), FinEdge Analytics (₹7.2L)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
