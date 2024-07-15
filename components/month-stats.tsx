"use client";
import DashboardCard from "@/components/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/data/types";
import { centsToDollarString, fetcher } from "@/lib/utils";
import React, { useEffect } from "react";
import useSWR from "swr";

export function MonthStats(): JSX.Element {
  const curDate = new Date();
  const startDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const endDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    curDate.getDate() + 1,
    0,
    0,
    0,
    0
  );

  const curMonth = curDate.toLocaleString("default", { month: "long" });
  const searchParams = {
    startDatetime: startDate.toISOString(),
    endDatetime: endDate.toISOString(),
  };
  const { data, error } = useSWR(
    ["/api/transaction/get-for-filters", searchParams],
    ([url, params]) => fetcher(url, params)
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardCard title={`${curMonth} spend`}>
        {data ? (
          <div className="text-sm">
            {centsToDollarString(sumMonthSpend(data.transactions))}
          </div>
        ) : (
          <Skeleton className="w-auto h-5" />
        )}
      </DashboardCard>
      <DashboardCard title="U balled on">
        {data ? (
          <div className="text-sm">
            {findHighestSpendDay(data.transactions).date.toLocaleString(
              "default",
              {
                month: "long",
                day: "numeric",
              }
            )}{" "}
            -{" "}
            {centsToDollarString(
              findHighestSpendDay(data.transactions).amountCents
            )}
          </div>
        ) : (
          <Skeleton className="w-auto h-5" />
        )}
      </DashboardCard>
    </div>
  );
}

function sumMonthSpend(transactions: Transaction[]): number {
  return transactions.reduce((acc, cur) => acc + cur.amount_cents, 0);
}

function findHighestSpendDay(transactions: Transaction[]): {
  date: Date;
  amountCents: number;
} {
  const daySpendMap: Record<string, number> = {};
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    const date = new Date(transaction.timestamp_utc);
    const dateKey = date.toISOString().split("T")[0];
    if (daySpendMap[dateKey]) {
      daySpendMap[dateKey] += transaction.amount_cents;
    } else {
      daySpendMap[dateKey] = transaction.amount_cents;
    }
  }
  const maxSpendDay = Array.from(Object.entries(daySpendMap)).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  return { date: new Date(maxSpendDay[0]), amountCents: maxSpendDay[1] };
}
