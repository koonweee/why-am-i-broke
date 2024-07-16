import { CurrencyCode } from "@/data/types";
import prisma from "@/db";
import {
  TransactionCreationRequest,
  transactionCreationRequestSchema,
} from "../types";
import { revalidatePath } from "next/cache";

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
    return new Response(
      JSON.stringify({ error: error, request: requestJson }),
      {
        status: 400,
      }
    );
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
  const insertTimestamp = new Date(timestamp_utc);
  // SQL insert
  try {
    //   await sql`
    //   INSERT INTO transactions (is_positive, amount_cents, description, category, timestamp_utc, currency_code)
    //   VALUES (${is_positive}, ${amount_cents}, ${description}, ${category}, ${jsDateToSQLUTCTimestamp(
    //     insertTimestamp
    //   )}, ${currency_code ?? CurrencyCode.USD})
    // `;

    await prisma.transactions.create({
      data: {
        is_positive: is_positive,
        amount_cents: amount_cents,
        description: description,
        category: category,
        timestamp_utc: insertTimestamp,
        currency_code: currency_code ?? CurrencyCode.USD,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }

  // Return the amount
  return new Response(JSON.stringify({ requestJson, status: 200 }), {
    status: 200,
  });
}
