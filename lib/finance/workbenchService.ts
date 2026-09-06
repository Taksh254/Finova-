/**
 * FINOVA Controller Workbench Service
 * Deterministic Financial Reconciliation, Exception Investigation,
 * Safety Guardrails, Bounded Policy Backtesting & Audit System.
 *
 * Principle: "AI proposes. Deterministic checks verify. Finance approves. Policies automate within boundaries."
 */

export interface AuditEvent {
  id: string;
  timestamp: string;
  timeDisplay: string;
  actor: string;
  action: string;
  reason?: string;
  details: string;
  policyVersion?: string;
  severity?: "normal" | "success" | "warning" | "danger";
}

export interface WorkbenchState {
  stage: number; // 1 to 9
  activeTab: "close" | "exceptions" | "audit" | "evaluation";
  period: "September 2026" | "October 2026";
  reconciliationRun: boolean;
  selectedExceptionId: string;
  entryApproved: boolean;
  policyProposed: boolean;
  policyBacktested: boolean;
  policyActive: boolean;
  octoberReplayed: boolean;
  auditTrail: AuditEvent[];
}

export const INITIAL_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: "aud-01",
    timestamp: "2026-09-12T10:14:00Z",
    timeDisplay: "Sep 12 10:14",
    actor: "System Rail",
    action: "Bank & GL files loaded",
    details: "finova_bank_sep.csv and finova_gl_sep.csv loaded (30 txns each)",
    severity: "normal",
  },
  {
    id: "aud-02",
    timestamp: "2026-09-12T10:15:00Z",
    timeDisplay: "Sep 12 10:15",
    actor: "Agent",
    action: "Agent suggested journal entry",
    details: "Dr 6110 Software Expense ₹1,00,000 / Cr 1001 Bank ₹1,00,000",
    severity: "normal",
  },
  {
    id: "aud-03",
    timestamp: "2026-09-12T10:16:00Z",
    timeDisplay: "Sep 12 10:16",
    actor: "Safety Engine",
    action: "Deterministic checks completed",
    details: "5/5 checks passed: Balanced, Invoice exists, Accounts allowed, Period open, No duplicate",
    severity: "success",
  },
  {
    id: "aud-04",
    timestamp: "2026-09-12T10:18:00Z",
    timeDisplay: "Sep 12 10:18",
    actor: "Priya Sharma (Controller)",
    action: "Approved by Priya Sharma",
    details: "Single entry approved for CLOUDFLARE*PRO ₹1,00,000 (CF-928374)",
    severity: "success",
  },
  {
    id: "aud-05",
    timestamp: "2026-09-12T10:20:00Z",
    timeDisplay: "Sep 12 10:20",
    actor: "Policy Engine",
    action: "Policy proposed",
    details: "Cloudflare < ₹1,50,000 (US entity, USD, invoice required, GL 6110)",
    severity: "normal",
  },
  {
    id: "aud-06",
    timestamp: "2026-09-12T10:25:00Z",
    timeDisplay: "Sep 12 10:25",
    actor: "Priya Sharma",
    action: "Policy activated (v1.0)",
    details: "Backtested 12 matches, 2 blocks, 0 false positives. Activated for recurring runs.",
    policyVersion: "v1.0",
    severity: "success",
  },
  {
    id: "aud-07",
    timestamp: "2026-10-03T09:10:00Z",
    timeDisplay: "Oct 03 09:10",
    actor: "Policy Engine v1.0",
    action: "Transaction automatically cleared",
    details: "CLOUDFLARE*PRO ₹1,25,000 with invoice matched policy limits",
    policyVersion: "v1.0",
    severity: "success",
  },
  {
    id: "aud-08",
    timestamp: "2026-10-14T09:12:00Z",
    timeDisplay: "Oct 14 09:12",
    actor: "Safety Engine",
    action: "Transaction blocked",
    details: "CLOUDFLARE*PRO ₹7,00,000 exceeds ₹1,50,000 policy limit",
    policyVersion: "v1.0",
    severity: "warning",
  },
  {
    id: "aud-09",
    timestamp: "2026-10-21T11:04:00Z",
    timeDisplay: "Oct 21 11:04",
    actor: "Safety Engine",
    action: "Transaction blocked",
    details: "CLOUDFLARE*PRO ₹1,25,000 blocked: Required invoice evidence missing",
    policyVersion: "v1.0",
    severity: "danger",
  },
];

class WorkbenchService {
  private state: WorkbenchState;

  constructor() {
    this.state = this.getInitialState();
  }

  public getInitialState(): WorkbenchState {
    return {
      stage: 1,
      activeTab: "close",
      period: "September 2026",
      reconciliationRun: false,
      selectedExceptionId: "exc-cloudflare",
      entryApproved: false,
      policyProposed: false,
      policyBacktested: false,
      policyActive: false,
      octoberReplayed: false,
      auditTrail: [...INITIAL_AUDIT_TRAIL],
    };
  }

  public getState(): WorkbenchState {
    return this.state;
  }

  public reset(): WorkbenchState {
    this.state = this.getInitialState();
    return this.state;
  }

  public setStage(stage: number): WorkbenchState {
    this.state.stage = stage;
    if (stage === 1) {
      this.state.activeTab = "close";
      this.state.period = "September 2026";
    } else if (stage >= 2 && stage <= 7) {
      this.state.activeTab = "exceptions";
      if (stage === 7) {
        this.state.period = "October 2026";
        this.state.octoberReplayed = true;
      } else {
        this.state.period = "September 2026";
      }
    } else if (stage === 8) {
      this.state.activeTab = "audit";
    } else if (stage === 9) {
      this.state.activeTab = "evaluation";
    }
    return this.state;
  }

  public setActiveTab(tab: "close" | "exceptions" | "audit" | "evaluation"): WorkbenchState {
    this.state.activeTab = tab;
    if (tab === "close") this.state.stage = 1;
    if (tab === "exceptions") {
      if (this.state.stage < 2 || this.state.stage > 7) {
        this.state.stage = 2;
      }
    }
    if (tab === "audit") this.state.stage = 8;
    if (tab === "evaluation") this.state.stage = 9;
    return this.state;
  }

  public runReconciliation(): WorkbenchState {
    this.state.reconciliationRun = true;
    this.state.stage = 2;
    this.state.activeTab = "exceptions";
    return this.state;
  }

  public selectException(id: string): WorkbenchState {
    this.state.selectedExceptionId = id;
    return this.state;
  }

  public approveEntry(actor: string = "Priya Sharma (Controller)"): WorkbenchState {
    this.state.entryApproved = true;
    this.state.stage = 5; // Move to policy proposal
    this.state.policyProposed = true;
    return this.state;
  }

  public backtestPolicy(): WorkbenchState {
    this.state.policyBacktested = true;
    this.state.stage = 6; // Move to policy backtest
    return this.state;
  }

  public activatePolicy(actor: string = "Priya Sharma"): WorkbenchState {
    this.state.policyActive = true;
    this.state.stage = 7; // Move to October replay
    this.state.period = "October 2026";
    this.state.octoberReplayed = true;
    return this.state;
  }
}

// Global singleton for server-side persistence across requests
const globalForWorkbench = global as unknown as { workbenchService?: WorkbenchService };
export const workbenchService = globalForWorkbench.workbenchService || new WorkbenchService();
if (process.env.NODE_ENV !== "production") globalForWorkbench.workbenchService = workbenchService;
