export enum CurrencyCode {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  SGD = "SGD",
}

export type Transaction = {
  uuid: string;
  date: Date;
  is_positive: boolean;
  amount_cents: number;
  currency_code: CurrencyCode;
  description: string;
  category: string;
};

export type AggregatedTransactions = {
  aggregated_by: AggregateBy;
  aggregated_value: string; // ie "2023-06-01" or "2023-06" or "2023 W1" or "2023"
  total_amount_cents: number;
  transaction_count: number;
};

export enum AggregateBy {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}
