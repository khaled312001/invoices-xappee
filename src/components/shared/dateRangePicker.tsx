"use client";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const DateRangePicker = () => {
  const parseSavedDateRange = (): DateRange | undefined => {
    try {
      const raw = localStorage.getItem("dateRange");
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      if (!parsed?.from) return undefined;
      return {
        from: new Date(parsed.from),
        to: parsed.to ? new Date(parsed.to) : undefined,
      };
    } catch {
      return undefined;
    }
  };

  const [date, setDate] = useState<DateRange | undefined>(parseSavedDateRange);

  useEffect(() => {
    if (!date?.from) return;
    const from = new Date(date.from);
    const to = date.to ? new Date(date.to) : undefined;
    if (isNaN(from.getTime())) return;
    localStorage.setItem(
      "dateRange",
      JSON.stringify({ from: from.toISOString(), to: to?.toISOString() })
    );
  }, [date]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[230px] justify-start text-left font-normal rounded-xl",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy-MM-dd")} -{" "}
                  {format(date.to, "yyyy-MM-dd")}
                </>
              ) : (
                format(date.from, "yyyy-MM-dd")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
