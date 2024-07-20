"use client";

import { Area, AreaChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { AggregateBy, AggregatedTransactions } from "@/data/types";
import { centsToDollarString, dateToLegibleString } from "@/lib/utils";
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
    valueFormatter: (value: number) => centsToDollarString(value, true),
  },
} satisfies ChartConfig;

interface Props {
  aggregatedTransactions: AggregatedTransactions[];
}

export function TransactionsChartInner({ aggregatedTransactions }: Props) {
  const { aggregated_by } = aggregatedTransactions[0];
  const xAxisFormatter = getXAxisFormatter(aggregated_by);
  const formattedData = aggregatedTransactions.map((d) => ({
    ...d,
    aggregated_value: xAxisFormatter(d.aggregated_value),
  }));
  return aggregatedTransactions.length ? (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={formattedData}
        margin={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* <CartesianGrid vertical={true} /> */}
        <XAxis
          dataKey="aggregated_value"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={5}
          hide
        />
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
        return dateToLegibleString(date, false);
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
