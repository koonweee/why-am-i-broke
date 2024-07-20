"use client";
import DashboardCard from "@/components/dashboard-card";
import {
  aggregateTransactions,
  TransactionsChartInner,
} from "@/components/transactions-chart/inner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AggregateBy, Transaction } from "@/data/types";
import { useMonthUpToCurrentDate } from "@/hooks/useMonthUpToCurrentDate";
import { useTransactionsByFilters } from "@/hooks/useTransactionsByFilters";
import { centsToDollarString } from "@/lib/utils";
import Head from "next/head";
import React, { Suspense } from "react";

export default function TransactionsChart() {
  const { curMonthString, startDate, endDate } = useMonthUpToCurrentDate();
  const { data, error, isLoading } = useTransactionsByFilters({
    startDatetime: startDate,
    endDatetime: endDate,
    dateOrder: "asc",
  });

  const monthSpend = sumMonthSpend(data?.transactions || []);

  const aggregated_by = AggregateBy.DAY;

  const aggregatedTransactions = aggregateTransactions(
    data?.transactions || [],
    aggregated_by
  );
  return (
    <Card className="overflow-hidden">
      <Header monthName={curMonthString} monthSpend={monthSpend} />
      <CardContent className="p-0">
        {aggregatedTransactions.length === 0 ? (
          <Skeleton className="m-4 h-48" />
        ) : (
          <TransactionsChartInner
            aggregatedTransactions={aggregatedTransactions}
          />
        )}
      </CardContent>
    </Card>
  );
}

function sumMonthSpend(transactions: Transaction[]): number {
  return transactions.reduce((acc, cur) => acc + cur.amount_cents, 0);
}

function Header({
  monthName,
  monthSpend,
  isLoading,
}: {
  monthName: string;
  monthSpend: number;
  isLoading?: boolean;
}) {
  return (
    <CardHeader className="space-y-0 pb-0">
      <div className="flex justify-end">
        <div>
          <CardDescription className="text-end">
            {monthName} spend
          </CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              $
            </span>
            {centsToDollarString(monthSpend).split("$")[1]}
          </CardTitle>
        </div>
      </div>
    </CardHeader>
  );
}
