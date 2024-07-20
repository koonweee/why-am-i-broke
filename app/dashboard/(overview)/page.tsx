import RecentTransactions from "@/components/recent-transactions";
import TransactionsChart from "@/components/transactions-chart";
import TransactionsPieChart from "@/components/transactions-pie-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
      <TransactionsChart />
      <RecentTransactions />
      <TransactionsPieChart />
    </div>
  );
}
