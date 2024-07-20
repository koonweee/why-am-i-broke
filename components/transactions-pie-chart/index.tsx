"use client";
import { TransactionDataContext } from "@/components/context/transaction-data-provider";
import { TransactionsPieChartInner } from "@/components/transactions-pie-chart/inner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToDollarString, dateToLegibleString } from "@/lib/utils";
import { useContext } from "react";

export default function TransactionsPieChart() {
  const transactionData = useContext(TransactionDataContext);
  const {
    filters: { startDate, endDate = new Date() },
    data: { transactions },
  } = transactionData;
  const dateRange = getDateRangeString(startDate, endDate);
  return (
    <Card className="overflow-hidden">
      {/* <Header dateRange={dateRange} dateRangeSpend={sumOfTransactions} /> */}
      <CardContent className="p-0">
        {!transactions || transactions?.length === 0 ? (
          <Skeleton className="m-4 h-48" />
        ) : (
          <TransactionsPieChartInner transactions={transactions} />
        )}
      </CardContent>
    </Card>
  );
}

function Header({
  dateRange,
  dateRangeSpend,
}: {
  dateRange: string;
  dateRangeSpend?: number;
}) {
  return (
    <CardHeader className="space-y-0 pb-0">
      <div className="flex justify-end">
        <div className="text-end">
          <CardDescription>{dateRange}</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl justify-end">
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              $
            </span>
            {!!dateRangeSpend ? (
              centsToDollarString(dateRangeSpend, true).split("$")[1]
            ) : (
              <Skeleton className="w-24 h-8" />
            )}
          </CardTitle>
        </div>
      </div>
    </CardHeader>
  );
}

function getDateRangeString(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // If start and end date are the same month
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    const endDateIsLastDayOfMonth =
      end.getDate() ===
      new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
    const endDateIsToday = end.toDateString() === new Date().toDateString();
    const startDateIsFirstDayOfMonth = start.getDate() === 1;
    // If range is start of month to end of month/present, only show month
    if (
      startDateIsFirstDayOfMonth &&
      (endDateIsLastDayOfMonth || endDateIsToday)
    ) {
      const isCurrentYear = start.getFullYear() === new Date().getFullYear();
      return start.toLocaleDateString("en-US", {
        month: "long",
        year: isCurrentYear ? undefined : "numeric",
      });
    }
  }
  return `${dateToLegibleString(start)} - ${dateToLegibleString(end)}`;
}
