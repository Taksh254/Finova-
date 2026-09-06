import React from "react";
import { WorkbenchShell } from "@/components/workbench/WorkbenchShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Controller Workbench | FINOVA",
  description:
    "AI proposes. Deterministic checks verify. Finance approves. Policies automate within boundaries.",
};

export default function OverviewPage() {
  return <WorkbenchShell />;
}
