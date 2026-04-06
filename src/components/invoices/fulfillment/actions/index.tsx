"use client";
import { DateRangePicker } from "@/components/shared/dateRangePicker";

import { IChannel } from "@/types/channel";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import InvoiceActions from "./invoiceActions";
import { ToggleInvoiceOrdersView } from "./toggleInvoiceOrdersView";
import SelectChannels from "./selectChannel";
import ImportOrdersButton from "./importOrdersButton";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import UploadActions from "../upload-csv/fulfillment-upload-actions";
import SelectClient from "./selectClient";
import { useSelector } from "@/redux/store";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { AddExpenses } from "../invoice/addExpenses";
import exp from "constants";

export default function FulfillmentActionsContainer({
  channels,
  clients,
  isUploadinCsv,
}: {
  channels?: IChannel[];
  clients: any[];
  isUploadinCsv: boolean;
}) {
  const [selectedChannelIds, setSelectedChannelIds] = useState<number[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(undefined);
  const [expenseCause, setExpenseCause] = useState<string>('');
  const [expenseAmount, setExpenseValue] = useState<number>(0);
  const { uploadedFileOrdersMetaData: metadata } =
    useSelector(selectOrderSlice);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    try {
      const rangeString = localStorage.getItem("dateRange");
      if (rangeString) {
        const parsed = JSON.parse(rangeString);
        setRange({ from: parsed.from ? new Date(parsed.from) : undefined, to: parsed.to ? new Date(parsed.to) : undefined });
      } else if (metadata?.dateRange) {
        setRange(metadata.dateRange as DateRange);
      }
    } catch {
      if (metadata?.dateRange) setRange(metadata.dateRange as DateRange);
    }
  }, []);

  useEffect(() => {
    setSelectedChannelIds(selectedClient?.channel_ids ?? []);
  }, [selectedClient]);

  return (
    <div>
      <div className="flex items-center gap-2">
        {isUploadinCsv ? (
          <>
            <SelectClient
              clients={clients}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
            />
            <UploadActions />
          </>
        ) : (
          <>
            <DateRangePicker />
            <SelectChannels
              channels={channels}
              selectedChannelIds={selectedChannelIds}
              setSelectedChannelIds={setSelectedChannelIds}
            />
             <AddExpenses  setExpenseValue={setExpenseValue} setExpenseCause={setExpenseCause} expenseValue={expenseAmount} expenseCause={expenseCause}    />
             <ImportOrdersButton
              range={range}
              selectedChannelIds={selectedChannelIds}
            />
          </>
        )}

        <InvoiceActions
          selectedClientName={selectedClient?.name}
          clients={clients}
          range={range}
          selectedChannelIds={selectedChannelIds}
          expenseCause={expenseCause}
          expenseValue={expenseAmount}
        />
        <ToggleInvoiceOrdersView />
      </div>
    </div>
  );
}
