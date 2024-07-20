const { parse } = require("csv-parse");
import { Transaction } from "@/data/types";
import { jsDateToSQLUTCTimestamp } from "@/lib/utils";
import { db } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
const fs = require("fs");

const client = await db.connect();

async function seedTransactions() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  // Drop the table if it exists
  // await client.sql`DROP TABLE IF EXISTS transactions`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS transactions (
      uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      timestamp_utc TIMESTAMP NOT NULL,
      is_positive BOOLEAN NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency_code VARCHAR(3) NOT NULL,
      description TEXT,
      category VARCHAR(255) NOT NULL
    );
  `;
  await fs
    .createReadStream("./data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row: any) {
      const timestamp_utc = row[0] as string;
      const timestamp_as_june = timestamp_utc.replace("-07-", "-06-");
      const transaction = {
        is_positive: true,
        amount_cents: Number(row[3]) * 100,
        category: row[2],
        description: row[1],
        timestamp_utc: timestamp_as_june,
        currency_code: "USD",
      };

      client.sql`
        INSERT INTO transactions (timestamp_utc, is_positive, amount_cents, currency_code, description, category)
        VALUES (${transaction.timestamp_utc}, ${transaction.is_positive}, ${transaction.amount_cents}, ${transaction.currency_code}, ${transaction.description}, ${transaction.category})
        ON CONFLICT (uuid) DO NOTHING;
      `;
    });
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedTransactions();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
