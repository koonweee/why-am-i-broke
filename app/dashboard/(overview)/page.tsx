import RecentTransactions from "@/components/recent-transactions";
import TransactionsChart from "@/components/transactions-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  return (
    <div>
      <h1 className={`mb-4 text-xl md:text-2xl px-1`}>cash money $</h1>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentTransactions />
        <TransactionsChart />
      </div>
    </div>
  );
}
