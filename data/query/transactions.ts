import { AggregateBy, AggregatedTransactions, Transaction } from "@/data/types";
import { jsDateToSQLDate } from "@/lib/utils";
import { sql } from "@vercel/postgres";

export async function fetchRecentTransactions(numberOfTransactions: number) {
  try {
    const data =
      await sql<Transaction>`SELECT * FROM transactions ORDER BY date DESC LIMIT ${numberOfTransactions}`;
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
        to_char(date, ${sqlDateFormat}) as aggregated_value,
        COUNT(*) as transaction_count,
        CAST(SUM(amount_Cents) AS INTEGER) as total_amount_cents
      FROM transactions WHERE date >= ${jsDateToSQLDate(
        startDate
      )} AND date <= ${jsDateToSQLDate(endDate)}
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
