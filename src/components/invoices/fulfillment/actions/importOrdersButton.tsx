import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/custom/spinner";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { fetchOrdersThunk } from "@/redux/slices/orderSlice/thunks/fetchOrdersthunk";
import { useDispatch, useSelector } from "@/redux/store";
import { DownloadCloud } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useEffect, useState, useCallback } from "react";

export default function ImportOrdersButton({
  range: initialRange,
  selectedChannelIds,
}: {
  range: DateRange | undefined;
  selectedChannelIds: number[];
}) {
  const { ordersStatus } = useSelector(selectOrderSlice);
  const isLoading = ordersStatus === "loading";

  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const dispatch = useDispatch();

  // Sync the local state with the range prop when it changes
  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const { uploadedFileOrdersMetaData: metadata } =
  useSelector(selectOrderSlice);
  const getDateRange = () => {
    let range = undefined;
    const rangeString = localStorage.getItem("dateRange");

    if (rangeString) {
      try {
        console.log("rangeString", rangeString);
        range = JSON.parse(rangeString);
        console.log("JSON.parse(rangeString", JSON.parse(rangeString));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else if (metadata?.dateRange) {
      range = metadata.dateRange;
    }

    return range;
  };
  const handleImportOrders = useCallback(async () => {
    if (isLoading) return;
    const range = getDateRange(); // Fetch date range from localStorage at the moment of generation
    await dispatch(
      fetchOrdersThunk({
        dateRange: range,
        selectedChannelIds: selectedChannelIds,
      })
    );
  }, [range, selectedChannelIds, isLoading, dispatch]);

  return (
    <Button
      className="gap-2 font-semibold h-9 rounded-xl"
      disabled={isLoading}
      onClick={handleImportOrders}
    >
      Import
      {isLoading ? <Spinner /> : <DownloadCloud size={20} strokeWidth={2} />}
    </Button>
  );
}
