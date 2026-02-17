import { InvoiceActions } from "@/components/invoices/invoiceActions";
import InvoiceItemsTable from "@/components/invoices/storage/invoice/invoiceItemsTable";
import StorageInvoiceMetadata from "@/components/invoices/storage/invoice/metadata";
import { fetchClients } from "@/lib/services/client.service";
import { fetchInvoiceById } from "@/lib/services/invoice.service";
import React from "react";

export default async function StorageInvoice({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await fetchInvoiceById(params.id, "storage");
  let clients = [];
  try {
    clients = await fetchClients();
  } catch (err: any) {}


  if (!invoice)
    return (
      <div className="grid place-content-center h-full w-full">
        <p>
          {`  Can't find the requested invoice. Please make sure the page you want
          exists.`}
        </p>
      </div>
    );
  return (
    <main className="space-y-4">
      <section className="flex justify-between items-start">
        <div>
          <h1 className="text-lg">Storage Invoice</h1>
          <StorageInvoiceMetadata
            from={invoice.from}
            to={invoice.to}
            client={invoice.client}
          />
        </div>
        <div>
          <InvoiceActions invoiceType="storage" invoice={invoice} opened />
        </div>
      </section>
      <InvoiceItemsTable
        monthlySubtotal={invoice.monthlySubtotal}
        totalStorageSpace={invoice.totalStorageSpace}
        weeklySubTotal={invoice.weeklySubTotal}
        items={invoice.items}
        clients={clients}
        storageStartMonth={invoice.storageStartMonth}
      />
    </main>
  );
}
