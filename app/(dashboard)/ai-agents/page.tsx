import React from "react";
import { AgentOrchestrator } from "@/components/dashboard/AgentOrchestrator";
import { AICFOCommandCard } from "@/components/dashboard/AICFOCommandCard";
import styles from "./AIAgentsPage.module.css";

export default function AIAgentsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.introCard}>
          <h2 className={styles.title}>Autonomous AI Agent Fleet</h2>
          <p className={styles.description}>
            Finova operates as an autonomous financial operating system. Rather than passive static software,
            five specialized intelligent agents continuously coordinate in the background to inspect bank transactions,
            reconcile discrepancies, predict liquidity crunches, and enforce corporate spend policies.
          </p>
        </div>
        <div className={styles.commandCardWrapper}>
          <AICFOCommandCard />
        </div>
      </div>

      <div className={styles.orchestratorSection}>
        <AgentOrchestrator />
      </div>
    </div>
  );
}
