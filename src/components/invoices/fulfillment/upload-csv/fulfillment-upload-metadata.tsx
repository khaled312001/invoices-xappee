"use client";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { useSelector } from "@/redux/store";
import { format } from "date-fns";
import { Megaphone } from "lucide-react";
import { DateRange } from "react-day-picker";

export default function FulfillmentUploadMetadata() {
  const { uploadedFileOrdersMetaData: metadata } =
    useSelector(selectOrderSlice);
    let range: DateRange | undefined;
    const rangeString = localStorage.getItem("dateRange");

    if (rangeString) {
      try {
        range = JSON.parse(rangeString);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      if (metadata?.dateRange) {
        range = metadata.dateRange;
      }
    }


  return (
    <div className="text-sm text-muted-foreground space-y-2">
      <p className="font-medium">
        {metadata.dateRange.from === metadata.dateRange.to
          ? format(range.from, "yyyy-MM-dd")
          : format(range.from, "yyyy-MM-dd") +
            " ~ " +
            format(range.to, "yyyy-MM-dd")}
      </p>
      {/* <p className="text-primary text-sm flex items-center gap-2">
        <Megaphone size={20} /> Please make sure all channels belong to the same
        client.
      </p>
      <div className="flex flex-wrap items-center gap-[4px]">
        {metadata.channels.map((channel, i) => (
          <div key={i} className="relative group">
            <p className="flex items-center gap-1 border-2  border-dashed border-muted-foreground text-muted-foreground font-medium rounded-lg py-1 px-2 invisible">
              {channel.channelName.toLowerCase()}-
              {channel.channel.toLowerCase()}
            </p>
            <p className="absolute top-0 left-0 flex items-center gap-1 border-2 group-hover:text-base text-nowrap cursor-default  border-dashed border-muted-foreground text-muted-foreground font-medium rounded-lg py-1 px-2 transition-transform duration-200 ease-in-out group-hover:scale-150 group-hover:z-10 group-hover:bg-background">
              {channel.channelName.toLowerCase()}-
              {channel.channel.toLowerCase()}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
}
