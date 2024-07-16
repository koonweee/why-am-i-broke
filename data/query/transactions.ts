import { CurrencyCode, Transaction } from "@/data/types";
import prisma from "@/db";

export async function fetchTransactionsForFilters(filters: {
  startDate?: Date;
  endDate?: Date;
  numberOfTransactions?: number;
  offset?: number;
  timestampOrderBy?: "asc" | "desc";
}) {
  const {
    startDate,
    endDate,
    numberOfTransactions,
    offset = 0,
    timestampOrderBy,
  } = filters;
  try {
    const data = (await prisma.transactions
      .findMany({
        where: {
          timestamp_utc: {
            gte: startDate,
            lte: endDate,
          },
        },
        take: numberOfTransactions,
        skip: offset,
        orderBy: {
          timestamp_utc: timestampOrderBy ? timestampOrderBy : "desc",
        },
      })
      .then((data) =>
        data.map((d) => ({
          ...d,
          currency_code: d.currency_code as CurrencyCode,
          description: d.description ?? undefined,
        }))
      )) satisfies Transaction[];
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}
