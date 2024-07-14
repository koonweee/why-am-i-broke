"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AggregateBy, AggregatedTransactions, Transaction } from "@/data/types";
import { centsToDollarString, jsDateToSQLDate } from "@/lib/utils";
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

interface Props {
  data: AggregatedTransactions[];
}

export function TransactionsChartInner(props: Props) {
  const { data } = props;
  const { aggregated_by } =
    data.length > 0 ? data[0] : { aggregated_by: AggregateBy.DAY };
  const xAxisFormatter = getXAxisFormatter(aggregated_by as AggregateBy);
  const formattedData = data.map((d) => ({
    ...d,
    aggregated_value: xAxisFormatter(d.aggregated_value),
  }));
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart accessibilityLayer data={formattedData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="aggregated_value"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={2}
        />
        <YAxis
          type="number"
          domain={[0, "dataMax"]}
          tickLine={false}
          axisLine={false}
          tickCount={2}
          tickFormatter={(value: number) => centsToDollarString(value)}
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
