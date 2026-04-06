"use client";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { useSelector } from "@/redux/store";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function FulfillmentUploadMetadata() {
  const { uploadedFileOrdersMetaData: metadata } = useSelector(selectOrderSlice);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dateRange");
      if (raw) {
        const parsed = JSON.parse(raw);
        setRange({
          from: parsed.from ? new Date(parsed.from) : undefined,
          to: parsed.to ? new Date(parsed.to) : undefined,
        });
      } else if (metadata?.dateRange) {
        setRange({
          from: metadata.dateRange.from ? new Date(metadata.dateRange.from) : undefined,
          to: metadata.dateRange.to ? new Date(metadata.dateRange.to) : undefined,
        });
      }
    } catch {
      // ignore
    }
  }, [metadata]);

  if (!range?.from) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-2">
      <p className="font-medium">
        {range.to
          ? format(range.from, "yyyy-MM-dd") + " ~ " + format(range.to, "yyyy-MM-dd")
          : format(range.from, "yyyy-MM-dd")}
      </p>
    </div>
  );
}
