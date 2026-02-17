"use client";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import React from "react";
import InvoiceOrdersTable from "./ordersTable";
import InvoiceServicesTable from "./servicesTable";

export default function FulfillmentInvoiceontainer({
  invoice,
}: {
  invoice: any;
}) {
  const { getParam } = useSearchParams();
  const view = getParam("view") ?? "service";

  return (
    <div>
      {view === "order" ? (
        <InvoiceOrdersTable orders={invoice.orders} />
      ) : (
        <InvoiceServicesTable services={invoice.services} />
      )}
    </div>
  );
}
