import StorageActionsContainer from "@/components/invoices/storage/import/actionsContainer";
import StoragetMetadata from "@/components/invoices/storage/import/metadata";
import StorageContainer from "@/components/invoices/storage/invoice/container";
import { fetchClients } from "@/lib/services/client.service";
import React from "react";

export default async function Storage() {
  const clients = await fetchClients();

  return (
    <div>
      <section className="flex items-start justify-between">
        <h1 className="text-lg">Storage</h1>
        <StorageActionsContainer clients={clients} />
      </section>
      <StoragetMetadata />
      <br />
      <StorageContainer clients={clients}/>
    </div>
  );
}
