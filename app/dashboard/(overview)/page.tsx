import { MonthStats } from "@/components/month-stats";
import RecentTransactions from "@/components/recent-transactions";
import TransactionsChart from "@/components/transactions-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <MonthStats />
      <TransactionsChart />
      <RecentTransactions />
    </div>
  );
}
