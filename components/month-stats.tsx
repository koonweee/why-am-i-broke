"use client";
import DashboardCard from "@/components/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/data/types";
import { useMonthUpToCurrentDate } from "@/hooks/useMonthUpToCurrentDate";
import { useTransactionsByFilters } from "@/hooks/useTransactionsByFilters";
import { centsToDollarString } from "@/lib/utils";

export function MonthStats(): JSX.Element {
  const { curMonthString, startDate, endDate } = useMonthUpToCurrentDate();
  const { data, error, isLoading } = useTransactionsByFilters({
    startDatetime: startDate,
    endDatetime: endDate,
  });

  const transactions = data?.transactions?.length ? data.transactions : null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <DashboardCard title={`${curMonthString} spend`}>
        {transactions ? (
          <div className="text-sm">
            {centsToDollarString(sumMonthSpend(transactions))}
          </div>
        ) : (
          <Skeleton className="w-auto h-5" />
        )}
      </DashboardCard>
      <DashboardCard title="U balled on">
        {transactions ? (
          <div className="text-sm">
            {findHighestSpendDay(transactions).date.toLocaleString("default", {
              month: "long",
              day: "numeric",
            })}{" "}
            -{" "}
            {centsToDollarString(findHighestSpendDay(transactions).amountCents)}
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
    const dateKey = date.toLocaleDateString();
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
