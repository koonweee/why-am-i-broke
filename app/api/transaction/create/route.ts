import {
  TransactionCreationRequest,
  transactionCreationRequestSchema,
} from "../types";
import { jsDateToSQLUTCTimestamp } from "../../../../lib/utils";
import { sql } from "@vercel/postgres";
import { CurrencyCode } from "@/data/types";

export async function GET(request: Request) {
  return new Response("Hello World", { status: 200 });
}

export async function POST(request: Request) {
  // Extract 'amount' from the json body
  const requestJson = await request.json();
  // Validate the request
  try {
    transactionCreationRequestSchema.parse(requestJson);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.issues }), {
      status: 400,
    });
  }

  // Cast the request as a TransactionCreationRequest
  const {
    is_positive,
    amount_cents,
    description,
    category,
    timestamp_utc,
    currency_code,
  } = requestJson as TransactionCreationRequest;
  const insertTimestamp = timestamp_utc ? new Date(timestamp_utc) : new Date();
  // SQL insert
  try {
    await sql`
    INSERT INTO transactions (is_positive, amount_cents, description, category, timestamp_utc, currency_code)
    VALUES (${is_positive}, ${amount_cents}, ${description}, ${category}, ${jsDateToSQLUTCTimestamp(
      insertTimestamp
    )}, ${currency_code ?? CurrencyCode.USD})
  `;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // Return the amount
  return new Response(JSON.stringify({ requestJson }), {
    status: 200,
  });
}
