"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteTransactions(
  transactionUuids: string[],
  _formData?: FormData
) {
  // Delete transactions with the given UUIDs
  await prisma.transactions.deleteMany({
    where: {
      uuid: {
        in: transactionUuids,
      },
    },
  });
  // Revalidate path
  revalidatePath("/dashboard/transactions");
}
