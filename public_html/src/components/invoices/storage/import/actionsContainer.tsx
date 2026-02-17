"use client";
import React, { useState } from "react";
import { DownloadCloud } from "lucide-react";
import { DateRangePicker } from "@/components/shared/dateRangePicker";
import { DataSelector } from "@/components/shared/dataSelector";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/custom/spinner";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { useDispatch, useSelector } from "@/redux/store";
import { generateStorageInvoice } from "@/lib/services/invoice.service";
import { generateStorageInvoiceThunk } from "@/redux/slices/storageInvoiceSlice/thunks/generateStorageInvoiceThunk";
import { selectStorageInvoiceSlice } from "@/redux/slices/storageInvoiceSlice/selectors";
import { DateRange } from "react-day-picker";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";

export default function StorageActionsContainer({
  clients
}: {
  clients: any[];
}) {
  const { invoiceStatus } = useSelector(selectStorageInvoiceSlice);
  const [selectedClient, SetselectedClientId] = useState<string>("");
  const { getParam } = useSearchParams();
  //const rangeString = getParam("range");
  // const range = { from: new Date(), to: new Date() };
  // rangeString ? JSON.parse(rangeString) : undefined;
  const { uploadedFileOrdersMetaData: metadata } =
  useSelector(selectOrderSlice);
  const getDateRange = () => {
    let range = undefined;
    const rangeString = localStorage.getItem("dateRange");

    if (rangeString) {
      try {
        range = JSON.parse(rangeString);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else if (metadata?.dateRange) {
      range = metadata.dateRange;
    }

    return range;
  };

  const handleGenerate = () => {
    const range = getDateRange(); // Fetch date range from localStorage at the moment of generation
    dispatch(generateStorageInvoiceThunk({ range, selectedClient }));
  };
  
  const dispatch = useDispatch();

  return (
    <div className="flex gap-2 items-center">
      <DataSelector
        data={clients}
        itemKey="name"
        returnKey="name"
        selectData={SetselectedClientId}
        selectedData={selectedClient}
        text="clients"
        name={"name"}
      />
      <DateRangePicker />
      <Button
        disabled={invoiceStatus === "loading"}
        onClick={handleGenerate}
        className="gap-2 font-semibold h-9 rounded-xl"
      >
        Generate
        {invoiceStatus === "loading" ? (
          <Spinner />
        ) : (
          <DownloadCloud size={20} strokeWidth={2} />
        )}
      </Button>
    </div>
  );
}
