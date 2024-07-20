"use client";
import { TransactionDataContext } from "@/components/context/transaction-data-provider";
import DashboardCard from "@/components/dashboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToDollarString } from "@/lib/utils";
import { useContext } from "react";

export default function RecentTransactions() {
  const {
    data: { transactions = [] },
    status: { isLoading },
  } = useContext(TransactionDataContext);
  const recentTransactions = [...transactions].reverse().slice(0, 5);
  return (
    <DashboardCard title="Latest">
      {!isLoading ? (
        <div className="flex flex-col gap-1">
          {recentTransactions.map((transaction) => {
            const { uuid, amount_cents, description, is_positive } =
              transaction;
            return (
              <div key={uuid}>
                <div className="flex flex-row justify-between gap-4 text-sm">
                  <p>{description}</p>
                  <p>{centsToDollarString(amount_cents, is_positive)}</p>
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
