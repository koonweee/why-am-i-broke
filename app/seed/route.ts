import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { jsDateToSQLDate } from "@/lib/utils";
import { transactions } from "@/app/seed/seed-data";

const client = await db.connect();

async function seedTransactions() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  // Drop the table if it exists
  await client.sql`DROP TABLE IF EXISTS transactions`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS transactions (
      uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      date DATE,
      is_positive BOOLEAN,
      amount_cents INTEGER,
      currency_code VARCHAR(3),
      description TEXT,
      category VARCHAR(255)
    );
  `;
  const insertedTransactions = await Promise.all(
    transactions.map(
      (transaction) => client.sql`
        INSERT INTO transactions (uuid, date, is_positive, amount_cents, currency_code, description, category)
        VALUES (${transaction.uuid}, ${jsDateToSQLDate(transaction.date)}, ${
        transaction.is_positive
      }, ${transaction.amount_cents}, ${transaction.currency_code}, ${
        transaction.description
      }, ${transaction.category})
        ON CONFLICT (uuid) DO NOTHING;
      `
    )
  );

  return insertedTransactions;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
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
