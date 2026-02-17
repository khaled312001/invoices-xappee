import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

interface DatePickerProps {
  onDateChange: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    onDateChange(day); // Call the callback with the selected date
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`justify-start text-left font-normal rounded-xl ${!selectedDate && "text-muted-foreground"}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "yyyy-MM-dd") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl" align="end">
          <Calendar
            initialFocus
            mode="single" // Single date selection mode
            selected={selectedDate} // Use selected date directly
            onSelect={handleDateSelect} // Handle date selection
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
