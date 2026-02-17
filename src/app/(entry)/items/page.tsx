import { ItemsContainer } from "@/components/items/container";
import { NewItemsDialog } from "@/components/items/newItemsDialog";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth";
import { fetchClients } from "@/lib/services/client.service";
import { fetchPaginatedItems } from "@/lib/services/item.service";
import React from "react";

export default async function Items() {
  const { items, nextPage } = await fetchPaginatedItems(1);
  let clients = [];
  try {
    clients = await fetchClients();
  } catch (err: any) { }
  const session = await getCurrentSession();
  const user = session?.user;
  return (
    <main>
      {
        user && user.role === "admin" && (
          <section className="flex justify-between items-start">
            <h1 className="text-lg">Items</h1>
            <NewItemsDialog clients={clients} />
          </section>
        )
      }

      <section>
        <ItemsContainer initialItems={items} nextPage={nextPage} user={user} />
      </section>
    </main>
  );
}