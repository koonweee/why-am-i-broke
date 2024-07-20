"use client";
import { TransactionDataContext } from "@/components/context/transaction-data-provider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn, getPartOfDateAsStr } from "@/lib/utils";
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
  return (
    <Drawer open={open} onOpenChange={(newState: boolean) => setOpen(newState)}>
      <DrawerTrigger>
        <ListFilterIcon size={20} />
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col mx-4 mt-4 gap-2 text-sm font-semibold">
          Date range
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
              <Calendar mode="range" selected={range} onSelect={setRange} />
            </PopoverContent>
          </Popover>
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
  return `${from?.toLocaleDateString()} - ${to?.toLocaleDateString() ?? ""}`;
}
