"use client";
import { TransactionDataContext } from "@/components/context/transaction-data-provider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateToLegibleString, getPartOfDateAsStr } from "@/lib/utils";
import { CalendarIcon, ListFilterIcon } from "lucide-react";
import { useContext, useState } from "react";
import { DateRange } from "react-day-picker";
export default function TransactionFiltersMenu() {
  const { filters, setFilters } = useContext(TransactionDataContext);
  const { startDate, endDate } = filters;
  const curYear = Number(getPartOfDateAsStr(startDate, "year"));
  const [range, setRange] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });
  const formattedDateRange = formatDateRange(range);
  const onSubmit = (newDateRange: DateRange) => {
    setFilters({
      ...filters,
      startDate: newDateRange.from ?? startDate,
      endDate: newDateRange.to,
    });
  };
  const rangeSelected = range?.from && range?.to;
  const [open, setOpen] = useState(false);
  const [selectedQuickSelectDateRange, setSelectedQuickSelectDateRange] =
    useState<string | undefined>(undefined);
  const quickSelectDateRangeOptions = getQuickSelectDateRangeOptions();
  return (
    <Drawer open={open} onOpenChange={(newState: boolean) => setOpen(newState)}>
      <DrawerTrigger className={"focus:outline-none"}>
        <ListFilterIcon size={20} />
      </DrawerTrigger>
      <DrawerContent className={"focus:outline-none"}>
        <div className="flex flex-col mx-4 mt-4 gap-2 text-sm font-semibold py-4">
          <div className="pl-2">Date range</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <div className="flex items-center justify-start w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDateRange ? (
                    <span>{formattedDateRange}</span>
                  ) : (
                    <span>Select date range</span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={range}
                onSelect={(range) => {
                  setRange(range);
                  setSelectedQuickSelectDateRange(undefined);
                }}
              />
            </PopoverContent>
          </Popover>
          <div className="flex flex-row gap-2 justify-end">
            {quickSelectDateRangeOptions.map((option) => {
              return (
                <Button
                  key={option.label}
                  variant={
                    selectedQuickSelectDateRange === option.label
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => {
                    setSelectedQuickSelectDateRange(option.label);
                    setRange(option.value);
                  }}
                  size={"sm"}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>
        <DrawerFooter className="flex flex-row items-center justify-between">
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            onClick={() => {
              onSubmit(range!);
              setOpen(false);
            }}
            disabled={!rangeSelected}
          >
            Filter
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function formatDateRange(range?: DateRange) {
  if (!range) return undefined;
  const { from, to } = range;
  if (!from && !to) return undefined;
  return `${dateToLegibleString(from!)} - ${to ? dateToLegibleString(to) : ""}`;
}

function getQuickSelectDateRangeOptions() {
  const curDate = new Date();
  const curMonth = curDate.getMonth();
  const curYear = curDate.getFullYear();

  // Return options for last 3 months, including current month
  return Array.from({ length: 3 }).map((_, index) => {
    const date = new Date(curYear, curMonth - index);
    return {
      label: date.toLocaleDateString("en-US", {
        month: "long",
      }),
      value: {
        from: new Date(date.getFullYear(), date.getMonth(), 1),
        to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      },
    };
  });
}
