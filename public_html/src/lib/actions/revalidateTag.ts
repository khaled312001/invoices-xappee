"use server";

import { revalidateTag } from "next/cache";

export async function revalidateItemsInitialLoad() {
  revalidateTag("initialItems");
}

export async function revalidateClients() {
  revalidateTag("clients");
}

export async function revalidateUsers() {
  revalidateTag("users");
}

export async function revalidateClientInvoices() {
  revalidateTag("invoices");
}
