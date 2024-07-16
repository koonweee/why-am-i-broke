import DashboardCard from "@/components/dashboard-card";
import { TransactionsChartInner } from "@/components/transactions-chart/inner";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

export default async function TransactionsChart() {
  return (
    <DashboardCard>
      <Suspense fallback={<Skeleton className="w-full h-40" />}>
        <TransactionsChartInner />
      </Suspense>
    </DashboardCard>
  );
}
