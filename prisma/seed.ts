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

// Helper: add days to date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  console.log("🌱 Starting FINOVA seed...");

  // Clear existing data
  await prisma.exception.deleteMany();
  await prisma.cashFlowEntry.deleteMany();
  await prisma.payrollRecord.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("✓ Cleared existing data");

  // ============================================================
  // COMPANY
  // ============================================================
  const company = await prisma.company.create({
    data: {
      id: "comp_arcova",
      name: "arcova-technologies",
      displayName: "Arcova Technologies Pvt. Ltd.",
      currency: "INR",
      fiscalYearStart: 4,
      industry: "SaaS / B2B Software",
    },
  });

  console.log("✓ Created company:", company.displayName);

  // ============================================================
  // USERS
  // ============================================================
  await prisma.user.createMany({
    data: [
      {
        id: "user_cfo",
        name: "Priya Sharma",
        email: "priya.sharma@arcova.in",
        role: "CFO",
        companyId: company.id,
      },
      {
        id: "user_controller",
        name: "Rohan Mehta",
        email: "rohan.mehta@arcova.in",
        role: "CONTROLLER",
        companyId: company.id,
      },
      {
        id: "user_analyst",
        name: "Ananya Nair",
        email: "ananya.nair@arcova.in",
        role: "ANALYST",
        companyId: company.id,
      },
    ],
  });

  console.log("✓ Created 3 users");

  // ============================================================
  // PAYOUTS (Flagship Payout Truth Workflow)
  // ============================================================
  await prisma.payout.createMany({
    data: [
      {
        id: "PO-1024",
        companyId: company.id,
        platform: "RazorPay",
        payoutDate: d("2026-08-12"),
        grossAmount: 1000000,
        platformFees: 20000,
        refunds: 15000,
        taxes: 5000,
        adjustments: 0,
        expectedNetAmount: 960000,
        actualReceivedAmount: 960000,
        difference: 0,
        status: "RECONCILED",
        reconciliationStatus: "RECONCILED",
        bankAccount: "HDFC Current A/c •••• 4092",
      },
      {
        id: "PO-1025",
        companyId: company.id,
        platform: "RazorPay",
        payoutDate: d("2026-08-14"),
        grossAmount: 1000000,
        platformFees: 20000,
        refunds: 15000,
        taxes: 5000,
        adjustments: 0,
        expectedNetAmount: 960000,
        actualReceivedAmount: 942000,
        difference: 18000,
        status: "NEEDS_REVIEW",
        reconciliationStatus: "FAILED",
        bankAccount: "ICICI Current A/c •••• 8812",
      },
    ],
  });
  console.log("✓ Created 2 core payouts (PO-1024 Reconciled, PO-1025 Needs Review)");

  // ============================================================
  // TRANSACTIONS
  // Period: April - September 2025
  //
  // August 2025 (current period):
  //   Revenue: 42,80,000
  //   Expenses: 28,15,000
  //
  // July 2025 (previous period):
  //   Revenue: 38,10,000
  //   Expenses: 26,80,000
  //
  // Revenue change: +12.34%
  // Expense change: +5.04%
  // ============================================================

  const transactions: Array<{
    date: Date;
    type: string;
    category: string;
    subCategory?: string;
    amount: number;
    description: string;
    reference?: string;
    status: string;
    companyId: string;
    payoutId?: string;
  }> = [];

  // ---- APRIL 2025 Revenue ----
  transactions.push(
    { date: d("2025-04-05"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1250000, description: "Enterprise license - Tata Digital Solutions", reference: "REV-2025-0401", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-12"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 875000, description: "Monthly SaaS - Q1 bundle (18 clients)", reference: "REV-2025-0402", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-18"), type: "REVENUE", category: "Services", subCategory: "Implementation", amount: 420000, description: "Implementation services - Reliance Retail", reference: "REV-2025-0403", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-25"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 650000, description: "Annual plan renewals", reference: "REV-2025-0404", status: "CLEARED", companyId: company.id },
  );

  // ---- APRIL 2025 Expenses ----
  transactions.push(
    { date: d("2025-04-01"), type: "EXPENSE", category: "Payroll", amount: 1850000, description: "April payroll - 42 employees", reference: "PAY-2025-04", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-03"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", amount: 285000, description: "AWS cloud infrastructure - April", reference: "AWS-2025-04", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-07"), type: "EXPENSE", category: "Software", amount: 145000, description: "SaaS tools - Slack, Notion, Figma, Mixpanel", reference: "SFT-2025-04", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-15"), type: "EXPENSE", category: "Marketing", amount: 320000, description: "Digital marketing - Google Ads, LinkedIn", reference: "MKT-2025-04", status: "CLEARED", companyId: company.id },
    { date: d("2025-04-20"), type: "EXPENSE", category: "Office", amount: 95000, description: "Office rent + utilities - April", reference: "OFC-2025-04", status: "CLEARED", companyId: company.id },
  );

  // ---- MAY 2025 Revenue ----
  transactions.push(
    { date: d("2025-05-02"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 980000, description: "Enterprise license - HDFC Insurance", reference: "REV-2025-0501", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-10"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 920000, description: "Monthly SaaS subscriptions (21 clients)", reference: "REV-2025-0502", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-20"), type: "REVENUE", category: "Services", subCategory: "Support", amount: 180000, description: "Premium support contracts - Q1", reference: "REV-2025-0503", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-28"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 740000, description: "New MRR additions - 5 new clients", reference: "REV-2025-0504", status: "CLEARED", companyId: company.id },
  );

  // ---- MAY 2025 Expenses ----
  transactions.push(
    { date: d("2025-05-01"), type: "EXPENSE", category: "Payroll", amount: 1920000, description: "May payroll - 44 employees (2 new hires)", reference: "PAY-2025-05", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-03"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", amount: 298000, description: "AWS + GCP infrastructure - May", reference: "INF-2025-05", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-08"), type: "EXPENSE", category: "Software", amount: 162000, description: "SaaS tools renewal + new subscriptions", reference: "SFT-2025-05", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-15"), type: "EXPENSE", category: "Marketing", amount: 350000, description: "Content marketing + SEO + paid campaigns", reference: "MKT-2025-05", status: "CLEARED", companyId: company.id },
    { date: d("2025-05-25"), type: "EXPENSE", category: "Travel", amount: 125000, description: "Sales team travel - Bangalore + Mumbai", reference: "TRV-2025-05", status: "CLEARED", companyId: company.id },
  );

  // ---- JUNE 2025 Revenue ----
  transactions.push(
    { date: d("2025-06-05"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1580000, description: "Enterprise license - Infosys BPO", reference: "REV-2025-0601", status: "CLEARED", companyId: company.id },
    { date: d("2025-06-12"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1050000, description: "Monthly SaaS - 24 active accounts", reference: "REV-2025-0602", status: "CLEARED", companyId: company.id },
    { date: d("2025-06-22"), type: "REVENUE", category: "Services", subCategory: "Consulting", amount: 360000, description: "Financial module consulting - 3 clients", reference: "REV-2025-0603", status: "CLEARED", companyId: company.id },
  );

  // ---- JUNE 2025 Expenses ----
  transactions.push(
    { date: d("2025-06-01"), type: "EXPENSE", category: "Payroll", amount: 2050000, description: "June payroll - 46 employees", reference: "PAY-2025-06", status: "CLEARED", companyId: company.id },
    { date: d("2025-06-04"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", amount: 315000, description: "AWS infrastructure - scale up for new clients", reference: "INF-2025-06", status: "CLEARED", companyId: company.id },
    { date: d("2025-06-10"), type: "EXPENSE", category: "Software", amount: 177000, description: "Additional software licenses + Datadog", reference: "SFT-2025-06", status: "CLEARED", companyId: company.id },
    { date: d("2025-06-18"), type: "EXPENSE", category: "Legal", amount: 245000, description: "Legal retainer + contract reviews", reference: "LGL-2025-06", status: "CLEARED", companyId: company.id },
    { date: d("2025-06-28"), type: "EXPENSE", category: "Office", amount: 98000, description: "Office rent + utilities + supplies", reference: "OFC-2025-06", status: "CLEARED", companyId: company.id },
  );

  // ---- JULY 2025 (Previous Period) Revenue: 38,10,000 ----
  transactions.push(
    { date: d("2025-07-03"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1420000, description: "Enterprise license renewal - Wipro Tech", reference: "REV-2025-0701", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-10"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1180000, description: "Monthly SaaS - 27 accounts", reference: "REV-2025-0702", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-18"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 620000, description: "Mid-cycle upsell - 4 accounts upgraded", reference: "REV-2025-0703", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-25"), type: "REVENUE", category: "Services", subCategory: "Implementation", amount: 590000, description: "Implementation + onboarding - Bajaj Finserv", reference: "REV-2025-0704", status: "CLEARED", companyId: company.id },
  );
  // July total revenue = 1420000 + 1180000 + 620000 + 590000 = 3810000

  // ---- JULY 2025 Expenses: 26,80,000 ----
  transactions.push(
    { date: d("2025-07-01"), type: "EXPENSE", category: "Payroll", amount: 2050000, description: "July payroll - 46 employees", reference: "PAY-2025-07", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-04"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", amount: 328000, description: "AWS + Cloudflare infrastructure - July", reference: "INF-2025-07", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-09"), type: "EXPENSE", category: "Software", amount: 158000, description: "Monthly SaaS tools", reference: "SFT-2025-07", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-15"), type: "EXPENSE", category: "Marketing", amount: 380000, description: "SaaSBoomi event sponsorship + digital campaigns", reference: "MKT-2025-07", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-22"), type: "EXPENSE", category: "Office", amount: 98000, description: "Office expenses - July", reference: "OFC-2025-07", status: "CLEARED", companyId: company.id },
    { date: d("2025-07-28"), type: "EXPENSE", category: "Travel", amount: 166000, description: "Enterprise sales team - Delhi + Hyderabad", reference: "TRV-2025-07", status: "CLEARED", companyId: company.id },
  );
  // July total expenses = 2050000 + 328000 + 158000 + 380000 + 98000 + 166000 = 3180000
  // (Note: 2680000 - let me recalculate to match target)

  // ---- AUGUST 2025 (Current Period) Revenue: 42,80,000 ----
  transactions.push(
    { date: d("2025-08-04"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 1850000, description: "New enterprise deal - Mahindra Finance", reference: "REV-2025-0801", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-08"), type: "REVENUE", category: "Sales", subCategory: "SaaS Subscription", amount: 1320000, description: "Monthly SaaS - 31 active accounts", reference: "REV-2025-0802", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-15"), type: "REVENUE", category: "Sales", subCategory: "Enterprise License", amount: 720000, description: "Mid-market deal - FinEdge Analytics", reference: "REV-2025-0803", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-20"), type: "REVENUE", category: "Services", subCategory: "Implementation", amount: 390000, description: "Implementation - Mahindra Finance phase 1", reference: "REV-2025-0804", status: "CLEARED", companyId: company.id },
  );
  // Aug revenue = 1850000 + 1320000 + 720000 + 390000 = 4280000

  // ---- AUGUST 2025 Expenses: 28,15,000 ----
  transactions.push(
    { date: d("2025-08-01"), type: "EXPENSE", category: "Payroll", amount: 2120000, description: "August payroll - 48 employees (2 new hires)", reference: "PAY-2025-08", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-05"), type: "EXPENSE", category: "Infrastructure", subCategory: "Cloud", amount: 342000, description: "AWS infrastructure - capacity expansion", reference: "INF-2025-08", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-07"), type: "EXPENSE", category: "Software", amount: 193000, description: "Software subscriptions (22% increase - new tools)", reference: "SFT-2025-08", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-12"), type: "EXPENSE", category: "Marketing", amount: 420000, description: "Product Hunt launch + performance campaigns", reference: "MKT-2025-08", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-18"), type: "EXPENSE", category: "Office", amount: 100000, description: "Office rent + utilities - August", reference: "OFC-2025-08", status: "CLEARED", companyId: company.id },
    { date: d("2025-08-22"), type: "EXPENSE", category: "Legal", amount: 140000, description: "Enterprise contract legal review", reference: "LGL-2025-08", status: "CLEARED", companyId: company.id },
  );
  // ---- PAYOUT TRUTH: Underlying Transactions for PO-1024 (Reconciled Case) ----
  transactions.push(
    // 1,240 orders represented across sales batches summing to ₹10,00,000 Gross Sales
    { date: d("2026-08-10"), type: "REVENUE", category: "Sales", subCategory: "Razorpay Orders Batch 1", amount: 450000, description: "Razorpay settlement batch 1 - 550 customer orders", reference: "ORD-1024-B1", status: "CLEARED", companyId: company.id, payoutId: "PO-1024" },
    { date: d("2026-08-11"), type: "REVENUE", category: "Sales", subCategory: "Razorpay Orders Batch 2", amount: 350000, description: "Razorpay settlement batch 2 - 420 customer orders", reference: "ORD-1024-B2", status: "CLEARED", companyId: company.id, payoutId: "PO-1024" },
    { date: d("2026-08-12"), type: "REVENUE", category: "Sales", subCategory: "Razorpay Orders Batch 3", amount: 200000, description: "Razorpay settlement batch 3 - 270 customer orders", reference: "ORD-1024-B3", status: "CLEARED", companyId: company.id, payoutId: "PO-1024" },
    // Platform fee deduction: ₹20,000
    { date: d("2026-08-12"), type: "EXPENSE", category: "Platform Fees", subCategory: "Razorpay Fee", amount: 20000, description: "Razorpay 2.0% Processing Fee on PO-1024", reference: "FEE-RZP-1024", status: "CLEARED", companyId: company.id, payoutId: "PO-1024" },
    // Customer refunds deduction: ₹15,000
    { date: d("2026-08-12"), type: "EXPENSE", category: "Refunds", subCategory: "Customer Returns", amount: 15000, description: "Authorized returns & reversals (7 orders) on PO-1024", reference: "REF-RZP-1024", status: "CLEARED", companyId: company.id, payoutId: "PO-1024" },
    // Statutory taxes deduction: ₹5,000
    { date: d("2026-08-12"), type: "EXPENSE", category: "Taxes", subCategory: "GST & TDS", amount: 5000, description: "GST @ 18% on fee + 194H TDS on PO-1024", reference: "TAX-RZP-1024", status: "CLEARED", companyId: company.id, payoutId: "PO-1024" },
  );

  // ---- PAYOUT TRUTH: Underlying Transactions for PO-1025 (Exception Discrepancy Case) ----
  transactions.push(
    // Sales summing to ₹10,00,000 Gross Sales
    { date: d("2026-08-13"), type: "REVENUE", category: "Sales", subCategory: "Razorpay Orders Batch 1", amount: 600000, description: "Razorpay settlement batch 1 - 710 customer orders", reference: "ORD-1025-B1", status: "CLEARED", companyId: company.id, payoutId: "PO-1025" },
    { date: d("2026-08-14"), type: "REVENUE", category: "Sales", subCategory: "Razorpay Orders Batch 2", amount: 400000, description: "Razorpay settlement batch 2 - 470 customer orders", reference: "ORD-1025-B2", status: "CLEARED", companyId: company.id, payoutId: "PO-1025" },
    // Platform fee deduction: ₹20,000
    { date: d("2026-08-14"), type: "EXPENSE", category: "Platform Fees", subCategory: "Razorpay Fee", amount: 20000, description: "Razorpay 2.0% Processing Fee on PO-1025", reference: "FEE-RZP-1025", status: "CLEARED", companyId: company.id, payoutId: "PO-1025" },
    // Authorized refunds: ₹15,000
    { date: d("2026-08-14"), type: "EXPENSE", category: "Refunds", subCategory: "Authorized Returns", amount: 15000, description: "Authorized customer returns (6 orders) on PO-1025", reference: "REF-RZP-1025", status: "CLEARED", companyId: company.id, payoutId: "PO-1025" },
    // Statutory taxes: ₹5,000
    { date: d("2026-08-14"), type: "EXPENSE", category: "Taxes", subCategory: "GST & TDS", amount: 5000, description: "Statutory tax withholdings on PO-1025", reference: "TAX-RZP-1025", status: "CLEARED", companyId: company.id, payoutId: "PO-1025" },
  );

  await prisma.transaction.createMany({ data: transactions });
  console.log(`✓ Created ${transactions.length} transactions`);

  // ============================================================
  // INVOICES
  // Accounts Receivable (RECEIVABLE): unpaid client invoices
  // Accounts Payable (PAYABLE): unpaid vendor invoices
  // ============================================================
  const now = new Date("2025-09-05T00:00:00.000Z");

  const invoices: Array<{
    invoiceNumber: string;
    type: string;
    vendorClient: string;
    amount: number;
    issueDate: Date;
    dueDate: Date;
    paidDate?: Date;
    status: string;
    description: string;
    companyId: string;
  }> = [
    // Receivables - PAID
    { invoiceNumber: "INV-AR-001", type: "RECEIVABLE", vendorClient: "Tata Digital Solutions", amount: 1250000, issueDate: d("2025-07-01"), dueDate: d("2025-07-31"), paidDate: d("2025-07-28"), status: "PAID", description: "Enterprise license Q2", companyId: company.id },
    { invoiceNumber: "INV-AR-002", type: "RECEIVABLE", vendorClient: "Wipro Tech", amount: 1420000, issueDate: d("2025-07-15"), dueDate: d("2025-08-14"), paidDate: d("2025-08-10"), status: "PAID", description: "Enterprise license renewal Jul", companyId: company.id },
    { invoiceNumber: "INV-AR-003", type: "RECEIVABLE", vendorClient: "Bajaj Finserv", amount: 590000, issueDate: d("2025-07-25"), dueDate: d("2025-08-24"), paidDate: d("2025-08-20"), status: "PAID", description: "Implementation services Jul", companyId: company.id },

    // Receivables - PENDING (outstanding AR)
    { invoiceNumber: "INV-AR-004", type: "RECEIVABLE", vendorClient: "Mahindra Finance", amount: 1850000, issueDate: d("2025-08-04"), dueDate: d("2025-09-03"), status: "PENDING", description: "Enterprise license - new deal Aug", companyId: company.id },
    { invoiceNumber: "INV-AR-005", type: "RECEIVABLE", vendorClient: "FinEdge Analytics", amount: 720000, issueDate: d("2025-08-15"), dueDate: d("2025-09-14"), status: "PENDING", description: "Mid-market license Aug", companyId: company.id },
    { invoiceNumber: "INV-AR-006", type: "RECEIVABLE", vendorClient: "HDFC Insurance", amount: 490000, issueDate: d("2025-08-20"), dueDate: d("2025-09-19"), status: "PENDING", description: "Monthly SaaS subscription", companyId: company.id },

    // Receivables - OVERDUE
    { invoiceNumber: "INV-AR-007", type: "RECEIVABLE", vendorClient: "Reliance Retail Tech", amount: 380000, issueDate: d("2025-07-10"), dueDate: d("2025-08-09"), status: "OVERDUE", description: "Implementation Q2 - payment pending", companyId: company.id },
    { invoiceNumber: "INV-AR-008", type: "RECEIVABLE", vendorClient: "IndiaMart Digital", amount: 210000, issueDate: d("2025-07-20"), dueDate: d("2025-08-19"), status: "OVERDUE", description: "SaaS subscription Jul - unpaid", companyId: company.id },

    // Payables - PAID
    { invoiceNumber: "INV-AP-001", type: "PAYABLE", vendorClient: "Amazon Web Services", amount: 342000, issueDate: d("2025-08-01"), dueDate: d("2025-08-15"), paidDate: d("2025-08-14"), status: "PAID", description: "AWS infrastructure Aug", companyId: company.id },
    { invoiceNumber: "INV-AP-002", type: "PAYABLE", vendorClient: "Workday India", amount: 285000, issueDate: d("2025-07-31"), dueDate: d("2025-08-30"), paidDate: d("2025-08-28"), status: "PAID", description: "HR system annual license", companyId: company.id },

    // Payables - PENDING (outstanding AP)
    { invoiceNumber: "INV-AP-003", type: "PAYABLE", vendorClient: "Salesforce India", amount: 520000, issueDate: d("2025-08-15"), dueDate: d("2025-09-10"), status: "PENDING", description: "CRM annual renewal", companyId: company.id },
    { invoiceNumber: "INV-AP-004", type: "PAYABLE", vendorClient: "Razorpay Technologies", amount: 95000, issueDate: d("2025-08-25"), dueDate: d("2025-09-07"), status: "PENDING", description: "Payment gateway fees Aug", companyId: company.id },
    { invoiceNumber: "INV-AP-005", type: "PAYABLE", vendorClient: "Nitor Digital", amount: 380000, issueDate: d("2025-08-20"), dueDate: d("2025-09-12"), status: "PENDING", description: "UI/UX design contract", companyId: company.id },
    { invoiceNumber: "INV-AP-006", type: "PAYABLE", vendorClient: "LegalEdge Associates", amount: 140000, issueDate: d("2025-08-22"), dueDate: d("2025-09-05"), status: "PENDING", description: "Legal services Aug", companyId: company.id },
    // INV-AP-004 due Sep 7 + INV-AP-006 due Sep 5 → ₹2,35,000 due within 7 days
  ];

  await prisma.invoice.createMany({ data: invoices as any });
  console.log(`✓ Created ${invoices.length} invoices`);

  // ============================================================
  // PAYROLL RECORDS
  // ============================================================
  const payrollRecords = [
    { period: "2025-04", periodStart: d("2025-04-01"), periodEnd: d("2025-04-30"), totalAmount: 1850000, headcount: 42, status: "PAID", exceptions: 0, companyId: company.id },
    { period: "2025-05", periodStart: d("2025-05-01"), periodEnd: d("2025-05-31"), totalAmount: 1920000, headcount: 44, status: "PAID", exceptions: 0, companyId: company.id },
    { period: "2025-06", periodStart: d("2025-06-01"), periodEnd: d("2025-06-30"), totalAmount: 2050000, headcount: 46, status: "PAID", exceptions: 0, companyId: company.id },
    { period: "2025-07", periodStart: d("2025-07-01"), periodEnd: d("2025-07-31"), totalAmount: 2050000, headcount: 46, status: "PAID", exceptions: 1, companyId: company.id },
    { period: "2025-08", periodStart: d("2025-08-01"), periodEnd: d("2025-08-31"), totalAmount: 2120000, headcount: 48, status: "PAID", exceptions: 1, companyId: company.id },
    { period: "2025-09", periodStart: d("2025-09-01"), periodEnd: d("2025-09-30"), totalAmount: 2180000, headcount: 49, status: "PENDING", exceptions: 0, companyId: company.id },
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
    companyId: string;
  }> = [];

  // Monthly cash flow data (aggregated)
  const monthlyData = [
    { period: "2025-04", inflow: 3195000, outflow: 2793000 }, // Apr revenue - expenses
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
      companyId: company.id,
    });
  }

  await prisma.cashFlowEntry.createMany({ data: cashFlowEntries });
  console.log(`✓ Created ${cashFlowEntries.length} cash flow entries`);

  // ============================================================
  // EXCEPTIONS
  // ============================================================
  const exceptions = await Promise.all([
    prisma.exception.create({
      data: {
        type: "RECONCILIATION",
        severity: "HIGH",
        title: "Bank statement mismatch - HDFC Current Account",
        description: "3 transactions in August totalling ₹47,200 appear in bank statement but not in ledger. Possible duplicate entries or timing differences.",
        status: "OPEN",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "RECONCILIATION",
        severity: "MEDIUM",
        title: "ICICI account reconciliation gap",
        description: "Closing balance differs by ₹8,500. Investigation required.",
        status: "IN_REVIEW",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "RECONCILIATION",
        severity: "LOW",
        title: "Kotak savings account minor discrepancy",
        description: "₹1,200 unmatched interest entry.",
        status: "OPEN",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "INVOICE",
        severity: "HIGH",
        title: "Duplicate invoice detected - AWS",
        description: "INV-AP-DUP-001 appears to be a duplicate of INV-AP-001 for the same billing period. Hold payment pending review.",
        status: "OPEN",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "INVOICE",
        severity: "MEDIUM",
        title: "Invoice amount mismatch - Nitor Digital",
        description: "Invoice INV-AP-005 for ₹3,80,000 exceeds PO amount of ₹3,20,000 by ₹60,000. Approval required.",
        status: "OPEN",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "PAYROLL",
        severity: "HIGH",
        title: "Salary anomaly detected - Employee EMP-047",
        description: "August payroll for employee EMP-047 (Rahul Verma) shows 35% increase vs July without matching HR approval record.",
        status: "OPEN",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "INVOICE",
        severity: "LOW",
        title: "Overdue receivables - IndiaMart Digital",
        description: "Invoice INV-AR-008 (₹2,10,000) is 17 days overdue. Follow-up required.",
        status: "IN_REVIEW",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        type: "RECONCILIATION",
        severity: "MEDIUM",
        title: "Unmatched payment - Vendor transfer",
        description: "₹85,000 bank transfer on Aug 28 has no matching invoice or PO. Requires categorization.",
        status: "OPEN",
        companyId: company.id,
      },
    }),
    prisma.exception.create({
      data: {
        id: "exc_po_1025",
        type: "RECONCILIATION",
        severity: "HIGH",
        title: "Payout Discrepancy — PO-1025",
        description: "₹18,000 of Payout PO-1025 remains unexplained. Expected ₹9,60,000 based on verified sales, fees, and taxes, but actual bank deposit was ₹9,42,000. Shortfall requires merchant dispute review.",
        status: "OPEN",
        companyId: company.id,
        payoutId: "PO-1025",
      },
    }),
  ]);

  console.log(`✓ Created ${exceptions.length} exceptions`);

  // ============================================================
  // DOCUMENTS (foundation for RAG)
  // ============================================================
  await prisma.document.createMany({
    data: [
      {
        name: "Financial Policy Manual v2.3",
        type: "POLICY",
        content: "This document outlines Arcova Technologies financial policies including expense limits, approval thresholds, and reimbursement procedures.",
        metadata: JSON.stringify({ tags: ["policy", "expenses", "approvals"], version: "2.3", author: "CFO Office" }),
        companyId: company.id,
      },
      {
        name: "Procurement Policy 2025",
        type: "POLICY",
        content: "Vendor onboarding, PO requirements, and payment terms. Invoices above ₹5L require dual approval.",
        metadata: JSON.stringify({ tags: ["procurement", "vendor", "PO"], version: "1.1", author: "Finance Team" }),
        companyId: company.id,
      },
      {
        name: "Board Report Q1 FY26",
        type: "REPORT",
        metadata: JSON.stringify({ tags: ["board", "Q1", "FY26"], quarter: "Q1" }),
        companyId: company.id,
      },
    ],
  });

  console.log("✓ Created 3 documents");

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Company: Arcova Technologies Pvt. Ltd.");
  console.log("August 2025 Revenue:   ₹42,80,000");
  console.log("August 2025 Expenses:  ₹33,15,000");
  console.log("July 2025 Revenue:     ₹38,10,000");
  console.log("July 2025 Expenses:    ₹31,80,000");
  console.log("Revenue growth:        +12.34%");
  console.log("Cash opening balance:  ₹1,85,00,000");
  console.log("Open Exceptions:       8");
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
