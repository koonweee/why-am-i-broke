"use client";

import { Legend, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/data/types";
import { centsToDollarString, cn, sumTransactionAmounts } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

export function TransactionsPieChartInner({ transactions }: Props) {
  const { chartConfig, chartData } = groupTransactionsByCategory(transactions);
  return transactions.length ? (
    <ChartContainer config={chartConfig} className="my-6">
      <PieChart>
        <ChartTooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          dataKey="total_cents"
          nameKey="category"
          label={({ payload, ...props }) => {
            return (
              <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                dominantBaseline={props.dominantBaseline}
                fill={props.fill}
              >
                {/* {`${centsToDollarString(payload.total_cents, true)}`} */}
                {payload.category}
              </text>
            );
          }}
        />
      </PieChart>
    </ChartContainer>
  ) : (
    <Skeleton className="h-40" />
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-muted rounded-md p-2 text-sm border">
        <span className={"font-semibold"}>{payload[0].name}: </span>
        {centsToDollarString(payload[0].value, true)}
      </div>
    );
  }

  return null;
}

function groupTransactionsByCategory(transactions: Transaction[]) {
  const categoriesToTransactionsMap = new Map<string, Transaction[]>();
  transactions.forEach((transaction) => {
    const category = transaction.category;
    if (!categoriesToTransactionsMap.has(category)) {
      categoriesToTransactionsMap.set(category, []);
    }
    categoriesToTransactionsMap.get(category)?.push(transaction);
  });

  const categories = Array.from(categoriesToTransactionsMap.keys());

  const chartConfig: Record<string, any> = {};
  const chartData: {
    category: string;
    total_cents: number;
    fill: string;
    key: string;
  }[] = [];
  categories.map((category) => {
    const transactions = categoriesToTransactionsMap.get(category) || [];
    const total_cents = sumTransactionAmounts(transactions);
    const key = category
      .toLocaleLowerCase()
      .replaceAll(" ", "_")
      .replaceAll("/", "_");
    chartData.push({
      category,
      total_cents,
      fill: `var(--color-${key})`,
      key,
    });
  });

  // Sort chart data by total_cents (descending)
  chartData.sort((a, b) => b.total_cents - a.total_cents);

  // Create chart config
  chartData.forEach((data, index) => {
    chartConfig[data.key] = {
      label: data.category,
      color: `hsl(var(--chart-${index + 1}))`,
    };
  });

  return { chartConfig, chartData };
}
