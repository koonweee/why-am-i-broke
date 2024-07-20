import { AggregateBy, AggregatedTransactions, Transaction } from "@/data/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts date to ISO string (ie 2021-10-29T00:00:00.000Z),
 * replaces T with a space, and removes the fractional seconds and T
 * @param date JavaScript Date object
 * @returns
 */
export function jsDateToSQLUTCTimestamp(date: Date) {
  return date.toISOString().replace("T", " ").split(".")[0];
}

/**
 * SQl timestamps are always in UTC, of the form "2021-10-29 00:00:00"
 * Convert the sql timestamp into ISO string, and then into a JavaScript Date object
 * @param timestamp
 */
export function sqlUTCTimestampToJSDate(timestamp: string) {
  const isoString = timestamp.replace(" ", "T") + "Z";
  return new Date(isoString);
}

export function centsToDollarString(cents: number, is_positive: boolean) {
  return [
    is_positive ? "" : "-",
    (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
  ].join("");
}

export const fetcher = async (
  baseUrl: string,
  searchParams: Record<string, string>,
  formatData?: (data: any) => any
) => {
  // Create search params
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    urlSearchParams.append(key, value);
  });
  urlSearchParams.sort();
  const url = `${baseUrl}?${urlSearchParams.toString()}`;
  if (urlSearchParams.size === 0) {
    return {};
  }
  const response = await fetch(url);
  const data = await response.json();
  if (formatData) {
    return formatData(data);
  }
  return data;
};

export function pluralize(word: string, count: number) {
  return count === 1 ? word : word + "s";
}

export function sumTransactionAmounts(transactions: Transaction[]) {
  return transactions.reduce((acc, cur) => acc + cur.amount_cents, 0);
}

export function aggregateTransactions(
  transactions: Transaction[],
  aggregateBy: AggregateBy
): AggregatedTransactions[] {
  const aggregatedTransactions: AggregatedTransactions[] = [];
  const transactionsByKey: Record<string, Transaction[]> = {};
  transactions.forEach((transaction) => {
    const key = getAggregateKey(transaction, aggregateBy);
    if (transactionsByKey[key]) {
      transactionsByKey[key].push(transaction);
    } else {
      transactionsByKey[key] = [transaction];
    }
  });
  return Object.entries(transactionsByKey).map(([key, transactions]) => {
    const totalAmountCents = transactions.reduce(
      (acc, cur) => acc + cur.amount_cents,
      0
    );
    return {
      aggregated_by: aggregateBy,
      aggregated_value: key,
      total_amount_cents: totalAmountCents,
      transaction_count: transactions.length,
    };
  });
}

function getAggregateKey(
  transaction: Transaction,
  aggregateBy: AggregateBy
): string {
  const { timestamp_utc } = transaction;
  const date = new Date(timestamp_utc);
  switch (aggregateBy) {
    case AggregateBy.DAY:
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    case AggregateBy.WEEK:
      return `not implemented`;
    case AggregateBy.MONTH:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
      });
    case AggregateBy.YEAR:
      return date.getFullYear().toString();
  }
}

export function getPartOfDateAsStr(date: Date, part: "day" | "month" | "year") {
  switch (part) {
    case "day":
      return date.getDate().toString();
    case "month":
      return date.toLocaleDateString("en-US", { month: "short" });
    case "year":
      return date.getFullYear().toString();
  }
}
