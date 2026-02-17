"use client";

import { useSearchParams } from "@/lib/hooks/useSearchParams";
import React from "react";
import InvoiceRow from "./invoiceRow";
import { PrintFilterButton } from "./printFilterButton";

export default function ClientInvoicesList({
  invoices,
  client,
}: {
  invoices: any;
  client: string;
}) {

  const { getParam } = useSearchParams();

  if (invoices== undefined ||
   ( (invoices?.fullfillmentInvoices.length === 0) &&
   (invoices?.storageInvoices.length === 0))
  )
    return (
      <div className="w-full grid place-content-center text-muted-foreground">
        <p className="mt-[40vh]">No invoices to show.</p>
      </div>
    );

  const mixedInvoices = [
    ...invoices.fullfillmentInvoices,
    ...invoices.storageInvoices,
  ];

  const query = getParam("q");
  const type = getParam("type") || "";
  const printed = getParam("printed") || "all";

  const filterInvoices = (invoice: any) => {
    const matchesQuery = invoice._id
      .toLowerCase()
      .includes(query.toLowerCase());

    if (type === "fulfillment") {
      return matchesQuery && invoice.orders && invoice.orders.length > 0;
    } else if (type === "storage") {
      return matchesQuery && (!invoice.orders || invoice.orders.length === 0);
    }

    if (printed === "true") {
      return invoice.printed;
    } else if (printed === "all") {
      return invoice;
    }
    return matchesQuery; // Return all invoices that match the query if no specific type is selected
  };

  return (
    <div className="space-y-4">
      <table className="gap-10 table-auto w-full border-collapse ">
        <thead className="text-left">
          <tr>
            <th className="border p-2 text-muted-foreground">ID</th>
            <th className="border p-2 text-muted-foreground">From</th>
            <th className="border p-2 text-muted-foreground">To</th>
            <th className="border p-2 text-muted-foreground">Type</th>
            <th className="border p-2 text-muted-foreground">Orders</th>
            <th className="border p-2 text-muted-foreground">Services</th>
            <th className="border p-2 text-muted-foreground">Items</th>
            <th className="border p-2 text-muted-foreground">Date created</th>
            {/* <th className="border p-2 text-muted-foreground">
              <PrintFilterButton />
            </th> */}
            <th className="border p-2 text-muted-foreground text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {mixedInvoices.filter(filterInvoices).map((invoice) => (
            <InvoiceRow client={client} key={invoice._id} invoice={invoice} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
