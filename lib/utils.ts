import { AggregateBy } from "@/data/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts date to ISO string (ie 2021-10-29T00:00:00.000Z)
 * and then splits it to return only the date part (ie 2021-10-29)
 * @param date JavaScript Date object
 * @returns
 */
export function jsDateToSQLDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function centsToDollarString(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
