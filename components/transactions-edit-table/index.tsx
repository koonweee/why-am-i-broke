"use client";
import { TransactionDataContext } from "@/components/context/transaction-data-provider";
import { TransactionsEditTableInner } from "@/components/inner";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";

export function TransactionsEditTable() {
  const transactionData = useContext(TransactionDataContext);
  const {
    filters: { startDate },
    status: { isLoading },
    data: { aggregatedTransactions = [], sumOfTransactions, transactions = [] },
  } = transactionData;
  const transactionsExist = transactions.length > 0;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 15 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-20" />
        ))}
      </div>
    );
  }
  return transactionsExist ? (
    <TransactionsEditTableInner transactions={transactions} />
  ) : (
    <div className="text-center text-muted-foreground">
      No transactions found.
    </div>
  );
}
