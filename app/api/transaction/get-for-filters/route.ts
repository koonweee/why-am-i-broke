import { z } from "zod";

import { PrismaClient } from "@prisma/client";

/**
 * Fetches Transactions from the database based on the filters provided
 * @param request
 */
const prisma = new PrismaClient();

export async function GET(request: Request) {
  let requestFiltersFromParams;
  try {
    const { searchParams } = new URL(request.url);
    requestFiltersFromParams = {
      startDatetime: searchParams.get("startDatetime") ?? undefined,
      endDatetime: searchParams.get("endDatetime") ?? undefined,
      categories: searchParams.getAll("categories") ?? undefined,
      dateOrder: searchParams.get("dateOrder") ?? undefined,
    };
    // Validate the request
    TransactionFiltersSchema.parse(requestFiltersFromParams);
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 400,
    });
  }
  const { startDatetime, endDatetime, categories, dateOrder } =
    requestFiltersFromParams as TransactionFilters;

  const startDatetimeDate = new Date(startDatetime);
  const endDatetimeDate = new Date(endDatetime);

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        timestamp_utc: {
          gte: startDatetimeDate,
          lte: endDatetimeDate,
        },
        category: categories?.length
          ? {
              in: categories,
            }
          : undefined,
      },
      orderBy: {
        timestamp_utc: dateOrder === "desc" ? "desc" : "asc",
      },
    });
    return new Response(
      JSON.stringify({
        transactions: transactions,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

export interface TransactionFilters {
  startDatetime: string; // ISO 8601 datetime string ie. "2021-01-01T00:00:00Z"
  endDatetime: string; // ISO 8601 datetime string ie. "2021-01-01T00:00:00Z"
  categories?: string[]; // Array of category names
  dateOrder?: "asc" | "desc"; // Order by date
}

const TransactionFiltersSchema = z
  .object({
    startDatetime: z.string().datetime(),
    endDatetime: z.string().datetime(),
    categories: z.array(z.string()).optional(),
    dateOrder: z.enum(["asc", "desc"]).optional(),
  })
  .strict();
