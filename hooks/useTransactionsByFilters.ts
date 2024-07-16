"use client";
import { TransactionFilters } from "@/app/api/transaction/get-for-filters/route";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export function useTransactionsByFilters(filters: TransactionFiltersInput) {
  const {
    startDatetime,
    endDatetime,
    categories = [],
    dateOrder = "desc",
  } = filters;

  const searchParams: any = {};
  if (startDatetime) {
    searchParams.startDatetime = startDatetime.toISOString();
  }
  if (endDatetime) {
    searchParams.endDatetime = endDatetime.toISOString();
  }
  if (categories.length) {
    searchParams.categories = categories;
  }
  if (dateOrder) {
    searchParams.dateOrder = dateOrder;
  }
  return useSWR(
    ["/api/transaction/get-for-filters", searchParams],
    ([url, params]) => fetcher(url, params)
  );
}

export type TransactionFiltersInput = Omit<
  TransactionFilters,
  "startDatetime" | "endDatetime"
> & {
  startDatetime?: Date;
  endDatetime?: Date;
};
