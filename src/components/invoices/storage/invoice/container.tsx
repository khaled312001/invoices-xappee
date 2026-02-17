"use client";

import { selectStorageInvoiceSlice } from "@/redux/slices/storageInvoiceSlice/selectors";
import { useSelector } from "@/redux/store";
import InvoiceItemsTable from "./invoiceItemsTable";

export default function StorageContainer({ clients }: { clients:any[]}) {
  const { invoice } = useSelector(selectStorageInvoiceSlice);
  if (!invoice)
    return (
      <div className="text-center mt-[43vh]">
        <p className="text-muted-foreground"> No results.</p>
      </div>
    );
  return (
    <div>
      <InvoiceItemsTable
        items={invoice.StorageInvoicePerItem}
        monthlySubtotal={invoice.monthlySubtotal}
        weeklySubTotal={invoice.weeklySubTotal}
        totalStorageSpace={invoice.totalStorageSpace}
        clients={clients}
        storageStartMonth={invoice.storageStartMonth}
      />
    </div>
  );
}
