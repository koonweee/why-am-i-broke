import { CurrencyCode, type Transaction } from "../../../data/types";
import { z } from "zod";

export type TransactionCreationRequest = Omit<
  Transaction,
  "uuid" | "timestamp_utc" | "currency_code"
> & {
  timestamp_utc?: string;
  currency_code?: CurrencyCode;
};

export const transactionCreationRequestSchema = z
  .object({
    is_positive: z.boolean(),
    amount_cents: z.number(),
    description: z.string().optional(),
    category: z.string(),
    timestamp_utc: z.string().datetime().optional(), // Validates that date is in the format "YYYY-MM-DD"
    currency_code: z.nativeEnum(CurrencyCode).optional(),
  })
  .strict();
