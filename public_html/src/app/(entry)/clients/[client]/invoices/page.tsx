import ClientInvoicesList from "@/components/invoices/clientInvoices";
import ClientInvoicesFilters from "@/components/invoices/filters";
import { fetchInvoicesForClient } from "@/lib/services/invoice.service";
import React from "react";

export default async function ClientInvoices({
  params,
}: {
  params: { client: string };
}) {
  const invoices = await fetchInvoicesForClient(params.client);

  return (
    <div className="space-y-4">
      <section className="flex justify-between  items-center">
        <h1 className="text-lg">{params.client} Invoices</h1>
        <ClientInvoicesFilters />
      </section>
      <ClientInvoicesList client={params.client} invoices={invoices} />
    </div>
  );
}
