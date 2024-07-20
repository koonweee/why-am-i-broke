import { TransactionsEditTable } from "@/components/transactions-edit-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
};

interface Props {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default async function Page(props: Props) {
  const { searchParams } = props;
  const { query, page } = searchParams ?? {};
  return <TransactionsEditTable />;
}
