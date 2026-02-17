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
  const savedDateRange = JSON.parse(localStorage.getItem("dateRange") || "{}");
  const [date, setDate] = useState<DateRange | undefined>(savedDateRange);

  useEffect(() => {
  
    if (!date) return;

    
    const formatDateToUTC = (dateString) => {
      const date = new Date(dateString + 'Z'); // Ensure it's treated as UTC
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  };
  console.log("date", date);
  console.log("date", date.from);
  console.log("date", formatDateToUTC(date.from));
  if(date.from && formatDateToUTC(date.from) != "NaN-NaN-NaNTNaN:NaN:NaN.000Z"){
    console.log("to be saved", JSON.stringify({
      from: formatDateToUTC(date.from),
      to: formatDateToUTC(date.to),
    }));

    localStorage.setItem("dateRange", JSON.stringify({
      from: formatDateToUTC(date.from),
   to: formatDateToUTC(date.to),
   }));
    
  }

   
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
