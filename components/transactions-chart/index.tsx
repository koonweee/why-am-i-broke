"use client";
import { TransactionDataContext } from "@/components/context/transaction-data-provider";
import { TransactionsChartInner } from "@/components/transactions-chart/inner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToDollarString, getPartOfDateAsStr } from "@/lib/utils";
import { useContext } from "react";

export default function TransactionsChart() {
  const transactionData = useContext(TransactionDataContext);
  const {
    filters: { startDate },
    data: { aggregatedTransactions = [], sumOfTransactions },
  } = transactionData;
  return (
    <Card className="overflow-hidden">
      <Header
        monthName={getPartOfDateAsStr(startDate, "month")}
        monthSpend={sumOfTransactions}
      />
      <CardContent className="p-0">
        {aggregatedTransactions?.length === 0 ? (
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

function Header({
  monthName,
  monthSpend,
}: {
  monthName: string;
  monthSpend?: number;
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
            {!!monthSpend ? (
              centsToDollarString(monthSpend, true).split("$")[1]
            ) : (
              <Skeleton className="w-24 h-8" />
            )}
          </CardTitle>
        </div>
      </div>
    </CardHeader>
  );
}
