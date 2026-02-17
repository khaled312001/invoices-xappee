import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/custom/spinner";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { generateFulfullmentInvoiceThunk } from "@/redux/slices/orderSlice/thunks/generateFulfullmentInvoiceThunk";
import { useDispatch } from "@/redux/store";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function InvoiceActions({
  range,
  selectedChannelIds,
  clients,
  selectedClientName,
  expenseCause,
  expenseValue
}: {
  range?: DateRange | undefined;
  selectedChannelIds?: number[];
  clients: any[];
  selectedClientName?: string;
  expenseCause?: string;
  expenseValue?: number
}) {
  const { orders, ordersStatus } = useSelector(selectOrderSlice);
  const [client, setClient] = useState(undefined);

  useEffect(() => {
    const matchingClient = clients.find(
      (client) =>
        selectedChannelIds.every((id) => client.channel_ids.includes(id)) &&
        selectedChannelIds.length > 0 &&
        selectedChannelIds.length <= client.channel_ids.length
    );

    if (matchingClient) {
      setClient(matchingClient);
    } else {
      if (selectedChannelIds.length > 0) {
        setClient(undefined);
        toast.error(
          "Please make sure all selected cahnnels belong to the same client"
        );
      }
    }
  }, [clients, selectedChannelIds]);

  const dispatch = useDispatch();

  if (orders.length === 0) return null;
  const handleGenerateInvoice =async () => {
    try {
      console.log("handleGenerateInvoice",range);
      await dispatch(
        generateFulfullmentInvoiceThunk({
          orders,
          range,
          channels: selectedChannelIds,
          clientName: selectedClientName ?? client.name,
          expenseCause,
          expenseValue
        })
      );
    } catch (err: any) {
      toast.error("something went wrong")
    }
  };
  return (
    <Button
      disabled={orders.length === 0 || ordersStatus === "loading"}
      onClick={handleGenerateInvoice}
      className="gap-2 bg-foreground rounded-xl text-background font-semibold hover:bg-foreground/80"
    >
      Generate invoice{" "}
      <span className="text-xs">{selectedClientName ?? client?.name}</span>
      {ordersStatus === "loading" ? <Spinner /> : <ArrowRight size={20} />}
    </Button>
  );
}
