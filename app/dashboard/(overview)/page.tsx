import DashboardCard from "@/components/dashboard-card";
import { MonthStats } from "@/components/month-stats";
import RecentTransactions from "@/components/recent-transactions";
import TransactionsChart from "@/components/transactions-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Suspense fallback={<Skeleton className="w-full h-40" />}>
        <MonthStats />
      </Suspense>
      <TransactionsChart />
      <Suspense
        fallback={
          <DashboardCard>
            <Skeleton className="w-full h-40" />
          </DashboardCard>
        }
      >
        <RecentTransactions />
      </Suspense>
    </div>
  );
}
