import React from "react";
import { DashboardShellWrapper } from "@/components/shell/DashboardShellWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShellWrapper>{children}</DashboardShellWrapper>;
}
