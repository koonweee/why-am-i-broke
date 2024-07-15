import DashboardCard from "@/components/dashboard-card";
import { fetchRecentTransactions } from "@/data/query/transactions";
import { centsToDollarString } from "@/lib/utils";
import { unstable_noStore } from "next/cache";

export default async function RecentTransactions() {
  unstable_noStore();
  const recentTransactions = await fetchRecentTransactions(10);
  return (
    <DashboardCard title="Recent">
      <div className="flex flex-col gap-1">
        {recentTransactions.map((transaction) => {
          const { uuid, amount_cents, description } = transaction;
          return (
            <div key={uuid}>
              <div className="flex flex-row justify-between gap-4 text-sm">
                <p>{description}</p>
                <p>{centsToDollarString(amount_cents)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
