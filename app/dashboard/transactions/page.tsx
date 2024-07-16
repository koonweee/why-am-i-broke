import { MonthStats } from "@/components/month-stats";
import RecentTransactions from "@/components/recent-transactions";
import TransactionsChart from "@/components/transactions-chart";
import { TransactionsEditTable } from "@/components/transactions-edit-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Transactions",
};

interface Props {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default async function Page(props: Props) {
  const { searchParams } = props;
  const { query, page } = searchParams ?? {};
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-2">
          {Array.from({ length: 15 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-20" />
          ))}
        </div>
      }
    >
      <TransactionsEditTable
        query={query}
        page={page ? Number(page) : undefined}
      />
    </Suspense>
  );
}
