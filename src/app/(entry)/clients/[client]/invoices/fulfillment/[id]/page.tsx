import FulfillmentInvoiceontainer from "@/components/invoices/fulfillment/invoice/container";
import ToggleView from "@/components/invoices/fulfillment/invoice/toggleView";
import { fetchInvoiceById } from "@/lib/services/invoice.service";
import React from "react";

export default async function FulfillmentInvoice({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await fetchInvoiceById(params.id, "fulfillment");
  if (!invoice)
    return (
      <div className="grid place-content-center h-full w-full">
        <p>
          {` Can't find the requested invoice. Please make sure the page you want
          exists.`}
        </p>
      </div>
    );
  return (
    <main className=" space-y-4">
      <section className="flex items-center justify-between">
        <h1 className="text-lg"> Fulfillment invoice </h1>
        <ToggleView />
      </section>
      <FulfillmentInvoiceontainer invoice={invoice} />
    </main>
  );
}
