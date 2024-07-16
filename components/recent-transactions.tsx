import DashboardCard from "@/components/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTransactionsForFilters } from "@/data/query/transactions";
import { centsToDollarString } from "@/lib/utils";
import { unstable_noStore } from "next/cache";

export default async function RecentTransactions() {
  unstable_noStore();
  const recentTransactions = await fetchTransactionsForFilters({
    numberOfTransactions: 5,
  });
  return (
    <DashboardCard title="Recent">
      {recentTransactions.length ? (
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
      ) : (
        <Skeleton className="w-auto h-40" />
      )}
    </DashboardCard>
  );
}
