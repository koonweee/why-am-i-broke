import DashboardCard from "@/components/dashboard-card";
import { TransactionsChartInner } from "@/components/transactions-chart/inner";
import { fetchAggregatedTransactionsForDateRange } from "@/data/query/transactions";
import { AggregateBy } from "@/data/types";
import React from "react";

export default async function TransactionsChart() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const data = await fetchAggregatedTransactionsForDateRange(
    firstOfMonth,
    today,
    AggregateBy.DAY
  );
  return (
    <DashboardCard>
      <TransactionsChartInner data={data} />
    </DashboardCard>
  );
}
