import { AggregateBy } from "@/data/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts date to ISO string (ie 2021-10-29T00:00:00.000Z),
 * replaces T with a space, and removes the fractional seconds and T
 * @param date JavaScript Date object
 * @returns
 */
export function jsDateToSQLUTCTimestamp(date: Date) {
  return date.toISOString().replace("T", " ").split(".")[0];
}

/**
 * SQl timestamps are always in UTC, of the form "2021-10-29 00:00:00"
 * Convert the sql timestamp into ISO string, and then into a JavaScript Date object
 * @param timestamp
 */
export function sqlUTCTimestampToJSDate(timestamp: string) {
  const isoString = timestamp.replace(" ", "T") + "Z";
  return new Date(isoString);
}

export function centsToDollarString(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export const fetcher = async (
  baseUrl: string,
  searchParams: Record<string, string>
) => {
  // Create search params
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    urlSearchParams.append(key, value);
  });
  urlSearchParams.sort();
  const url = `${baseUrl}?${urlSearchParams.toString()}`;
  if (urlSearchParams.size === 0) {
    return {};
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
