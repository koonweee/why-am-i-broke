import {
  AggregateBy,
  AggregatedTransactions,
  SqlTransaction,
  sqlTransactionToTransaction,
  Transaction,
} from "@/data/types";
import { jsDateToSQLUTCTimestamp } from "@/lib/utils";
import { sql } from "@vercel/postgres";

export async function fetchRecentTransactions(
  numberOfTransactions: number,
  offset?: number
) {
  try {
    const data =
      await sql<Transaction>`SELECT * FROM transactions ORDER BY timestamp_utc DESC LIMIT ${numberOfTransactions} OFFSET ${
        offset ?? 0
      }`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchAggregatedTransactionsForDateRange(
  startDate: Date,
  endDate: Date,
  aggregateBy: AggregateBy
) {
  const sqlDateFormat = AGGREGATE_BY_TO_SQL_DATE_FORMAT[aggregateBy];
  try {
    const data = await sql<AggregatedTransactions>`
      SELECT
        ${aggregateBy} as aggregated_by,
        to_char(timestamp_utc, ${sqlDateFormat}) as aggregated_value,
        COUNT(*) as transaction_count,
        CAST(SUM(amount_Cents) AS INTEGER) as total_amount_cents
      FROM transactions WHERE timestamp_utc >= ${jsDateToSQLUTCTimestamp(
        startDate
      )} AND timestamp_utc <= ${jsDateToSQLUTCTimestamp(endDate)}
      GROUP BY aggregated_value
      ORDER BY aggregated_value ASC`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

const AGGREGATE_BY_TO_SQL_DATE_FORMAT: Record<AggregateBy, string> = {
  [AggregateBy.DAY]: "YYYY-MM-DD",
  [AggregateBy.WEEK]: "YYYY-WW",
  [AggregateBy.MONTH]: "YYYY-MM",
  [AggregateBy.YEAR]: "YYYY",
};
