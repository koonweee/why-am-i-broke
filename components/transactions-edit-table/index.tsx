import { fetchRecentTransactions } from "@/data/query/transactions";
import { Transaction } from "@/data/types";
import { centsToDollarString } from "@/lib/utils";
import { unstable_noStore } from "next/cache";

interface Props {
  query?: string;
  page?: number;
}

export async function TransactionsEditTable(props: Props) {
  unstable_noStore();
  const transactions = await fetchRecentTransactions(40);
  const groupedTransactions = groupTransactionsByDay(transactions);
  console.log(groupedTransactions);
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(groupedTransactions).map(([date, transactions]) => {
        const dateObj = new Date(date);
        return (
          <div key={date} className="flex flex-col">
            <div className="text-md font-semibold text-end border-b py-1">
              {dateObj.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </div>
            {transactions.map((transaction) => {
              return (
                <div
                  key={transaction.uuid}
                  className="flex flex-row justify-between border-b p-1 text-sm border-dashed hover:bg-muted"
                >
                  <div className="flex flex-col">
                    <div>{transaction.description}</div>
                    <div className="text-muted-foreground">
                      {transaction.category}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="text-end">
                      {centsToDollarString(transaction.amount_cents)}
                    </div>
                    <div className="text-muted-foreground text-end">
                      {transaction.timestamp_utc.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function groupTransactionsByDay(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};
  transactions.forEach((transaction) => {
    const date = transaction.timestamp_utc.toISOString().split("T")[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  return grouped;
}
