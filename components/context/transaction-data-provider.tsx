"use client";

import {
  AggregateBy,
  AggregatedTransactions,
  Order,
  Transaction,
} from "@/data/types";
import { useMonthUpToCurrentDate } from "@/hooks/useMonthUpToCurrentDate";
import { useTransactionsByFilters } from "@/hooks/useTransactionsByFilters";
import { aggregateTransactions, sumTransactionAmounts } from "@/lib/utils";
import { createContext, useState } from "react";

interface TransactionDataFilters {
  startDate: Date;
  endDate?: Date;
  aggregateBy?: AggregateBy;
  dateOrder?: Order;
}

interface TransactionDataContextValue {
  filters: TransactionDataFilters;
  setFilters: (filters: TransactionDataFilters) => void;
  status: {
    isLoading?: boolean;
    error?: any;
  };
  data: {
    transactions?: Transaction[];
    aggregatedTransactions?: AggregatedTransactions[];
    sumOfTransactions?: number;
  };
}

export const TransactionDataContext =
  createContext<TransactionDataContextValue>({
    filters: {
      startDate: new Date(),
    },
    setFilters: () => {},
    status: {},
    data: {},
  });

export default function TransactionDataProvider({
  children,
}: React.PropsWithChildren) {
  const { curMonthString, startDate, endDate } = useMonthUpToCurrentDate();
  const [filters, setFilters] = useState({
    startDate,
    endDate,
    aggregateBy: AggregateBy.DAY,
    dateOrder: Order.ASC,
  });

  const { data, error, isLoading } = useTransactionsByFilters({
    startDatetime: filters.startDate,
    endDatetime: filters.endDate,
    dateOrder: filters.dateOrder,
  });
  const contextValue: TransactionDataContextValue = {
    filters,
    setFilters: (filters) =>
      setFilters({
        ...filters,
        startDate: filters.startDate || startDate,
        endDate: filters.endDate || endDate,
        aggregateBy: filters.aggregateBy || AggregateBy.DAY,
        dateOrder: filters.dateOrder || Order.ASC,
      }),
    status: {
      isLoading,
      error,
    },
    data: {
      transactions: data?.transactions,
      aggregatedTransactions: aggregateTransactions(
        data?.transactions || [],
        filters.aggregateBy
      ),
      sumOfTransactions: sumTransactionAmounts(data?.transactions || []),
    },
  };

  return (
    <TransactionDataContext.Provider value={contextValue}>
      {children}
    </TransactionDataContext.Provider>
  );
}
