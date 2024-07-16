import { TransactionsEditTableInner } from "@/components/inner";
import { fetchTransactionsForFilters } from "@/data/query/transactions";
import { Transaction } from "@/data/types";
import { centsToDollarString } from "@/lib/utils";
import { unstable_noStore } from "next/cache";

interface Props {
  query?: string;
  page?: number;
}

export async function TransactionsEditTable(props: Props) {
  unstable_noStore();
  const transactions = await fetchTransactionsForFilters({
    numberOfTransactions: 100,
  });
  const transactionsExist = transactions.length > 0;
  return transactionsExist ? (
    <TransactionsEditTableInner transactions={transactions} />
  ) : (
    <div className="text-center text-muted-foreground">
      No transactions found.
    </div>
  );
}
