"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AggregateBy, AggregatedTransactions, Transaction } from "@/data/types";
import { centsToDollarString } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionsByFilters } from "@/hooks/useTransactionsByFilters";
import { useMonthUpToCurrentDate } from "@/hooks/useMonthUpToCurrentDate";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  total_amount_cents: {
    label: "Expense",
    color: "hsl(var(--muted-foreground))",
    valueFormatter: (value: number) => centsToDollarString(value),
  },
} satisfies ChartConfig;

export function TransactionsChartInner() {
  const { curMonthString, startDate, endDate } = useMonthUpToCurrentDate();
  const { data, error, isLoading } = useTransactionsByFilters({
    startDatetime: startDate,
    endDatetime: endDate,
    dateOrder: "asc",
  });

  const aggregated_by = AggregateBy.DAY;

  const aggregatedTransactions = aggregateTransactions(
    data?.transactions || [],
    aggregated_by
  );

  const xAxisFormatter = getXAxisFormatter(aggregated_by);
  const formattedData = aggregatedTransactions.map((d) => ({
    ...d,
    aggregated_value: xAxisFormatter(d.aggregated_value),
  }));
  return aggregatedTransactions.length ? (
    <ChartContainer config={chartConfig}>
      <AreaChart accessibilityLayer data={formattedData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="aggregated_value"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={5}
        />
        {/* <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickLine={false}
          axisLine={false}
          tickCount={2}
          tickFormatter={(value: number) => centsToDollarString(value)}
        /> */}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="total_amount_cents"
          type="natural"
          fill="var(--color-total_amount_cents)"
          fillOpacity={0.2}
          stroke="var(--color-total_amount_cents)"
          dot={{
            strokeWidth: 1,
            opacity: 0.8,
          }}
          activeDot={{
            strokeWidth: 2,
            opacity: 1,
            fill: "hsl(var(--accent-foreground))",
          }}
        />
      </AreaChart>
    </ChartContainer>
  ) : (
    <Skeleton className="h-40" />
  );
}

export function getXAxisFormatter(aggregateBy: AggregateBy) {
  switch (aggregateBy) {
    case AggregateBy.DAY:
      // YYYY-MM-DD to "Jun 12"
      return (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      };
    case AggregateBy.WEEK:
      // YYYY-WW to "2024, week 1"
      return (value: string) => {
        const [year, week] = value.split("-");
        return `${year}, week ${week}`;
      };
    case AggregateBy.MONTH:
      // YYYY-MM to "Jun, 2024"
      return (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      };
    case AggregateBy.YEAR:
      // YYYY to "2024"
      return (value: string) => value;
  }
}

export function aggregateTransactions(
  transactions: Transaction[],
  aggregateBy: AggregateBy
): AggregatedTransactions[] {
  const aggregatedTransactions: AggregatedTransactions[] = [];
  const transactionsByKey: Record<string, Transaction[]> = {};
  transactions.forEach((transaction) => {
    const key = getAggregateKey(transaction, aggregateBy);
    if (transactionsByKey[key]) {
      transactionsByKey[key].push(transaction);
    } else {
      transactionsByKey[key] = [transaction];
    }
  });
  return Object.entries(transactionsByKey).map(([key, transactions]) => {
    const totalAmountCents = transactions.reduce(
      (acc, cur) => acc + cur.amount_cents,
      0
    );
    return {
      aggregated_by: aggregateBy,
      aggregated_value: key,
      total_amount_cents: totalAmountCents,
      transaction_count: transactions.length,
    };
  });
}

function getAggregateKey(
  transaction: Transaction,
  aggregateBy: AggregateBy
): string {
  const { timestamp_utc } = transaction;
  const date = new Date(timestamp_utc);
  switch (aggregateBy) {
    case AggregateBy.DAY:
      return date.toLocaleDateString();
    case AggregateBy.WEEK:
      return `not implemented`;
    case AggregateBy.MONTH:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
      });
    case AggregateBy.YEAR:
      return date.getFullYear().toString();
  }
}
