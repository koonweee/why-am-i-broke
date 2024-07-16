import { CurrencyCode, type Transaction } from "../../../data/types";
import { z } from "zod";

export type TransactionCreationRequest = Omit<
  Transaction,
  "uuid" | "currency_code"
> & {
  currency_code?: CurrencyCode;
};

export const transactionCreationRequestSchema = z
  .object({
    is_positive: z.boolean(),
    amount_cents: z.number(),
    description: z.string().optional(),
    category: z.string(),
    timestamp_utc: z.string().datetime(), // Validates that date is in the format "2020-01-01T00:00:00Z
    currency_code: z.nativeEnum(CurrencyCode).optional(),
  })
  .strict();
