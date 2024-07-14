import DashboardCard from "@/components/dashboard-card";
import { fetchRecentTransactions } from "@/data/query/transactions";
import { centsToDollarString } from "@/lib/utils";

export default async function RecentTransactions() {
  const recentTransactions = await fetchRecentTransactions(5);
  return (
    <DashboardCard title="Recent">
      <div className="flex flex-col gap-1">
        {recentTransactions.map((transaction) => {
          const { uuid, amount_cents, description } = transaction;
          return (
            <div key={uuid}>
              <div className="flex flex-row justify-between gap-4">
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
