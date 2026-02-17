import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Fetch } from "../actions/fetch";
import { cache } from "react";
import { Console } from "console";
import { CustomInvoice } from "@/types/invoice";

export const fetchInvoiceById = async (
  _id: string,
  type: "fulfillment" | "storage"
) => {
  const { data } = await Fetch(`invoices/one/${_id}?type=${type}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  return data.invoice;
};

export const fetchInvoicesForClient = cache(async (client: string) => {
  const { data } = await Fetch(`invoices/${client}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    next: { tags: ["invoices"] },
  });
  return data.invocies;
});

export const generateStorageInvoice = async (params: any) => {
  const { range, selectedClient, clientEmail } = params;
  const { from, to } = range;
  if (!from || !to || !selectedClient) {
    throw new Error("Date range and client are required.");
  }
  const fromFormat = format(from, "yyyy-MM-dd");
  const toFormat = format(to, "yyyy-MM-dd");

  const { ok, data } = await Fetch(
    `invoices/storage/generate/${selectedClient}?from=${fromFormat}&to=${toFormat}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { tags: ["invoices"] },
    }
  );
  if (ok) {
    return data;
  } else {
    return false;
  }
};

export const generateFulfillmentInvoice = async ( 
  orders: any[],
  channels: number[] = [],
  clientName: string,
  range?: DateRange,
  expenseCause?: string,
  expenseValue?: number
) => {
  // Ensure orders is a valid array
  if (!orders || orders.length === 0) {
    throw new Error("Orders array is empty or not provided.");
  }

  // Ensure range is a valid DateRange object
  if (range && (range.from === null || range.to === null)) {
    throw new Error("Invalid date range provided.");
  }

  if (!clientName) {
    throw new Error("Client name is required.");
  }

  if (channels.length === 0) {
    throw new Error("At least one channel is required.");
  }

  const { data } = await Fetch(`invoices/generate`, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify({
      ids: orders.map((o) => o.id),
      dateRange: range,
      clientName,
      channels,
      expenseValue,
      expenseCause,
    }),
  });

  return await data;
};

export const deleteInvoice = async (_id: string, type: string) => {
  const { ok } = await Fetch(`invoices/${_id}?type=${type}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (ok) {
    return true;
  } else {
    return false;
  }
};

export const updateInvoice = async (_id: string, type: string, data: any) => {
  try {
    const { ok } = await Fetch(`invoices/${_id}?type=${type}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ invoice: data }),
    });
    // if (ok) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (err: any) {
    return false;
  }
};

export const postCarrierCharges = async (newCharges: {}) => {
  const { ok, data } = await Fetch(`invoices/fulcharges`, {
    method: "POST",
    body: JSON.stringify({ newCharges: newCharges }),
  });
  return data.carriers;
};

export const getStorageFees = async () => {
  const { data } = await Fetch(`invoices/storage/charges`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  return data.storage;
};


export const postStorageCharges = async (newCharges: {}) => {
  const { ok, data } = await Fetch(`invoices/storgecharges`, {
    method: "POST",
    body: JSON.stringify({ newCharges: newCharges }),
  });
  return data.carriers;
};



export const addCustomInvoice = async (invoice: any) => {
  const { ok, data } = await Fetch(`invoices/custom-invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice,
    }),
  });
  return { ok, data };
};

export const getCustomInvoices = async () => {
  const { ok, data } = await Fetch(`invoices/custom-invoices`, {
    method: "GET",
    cache: "default",
  });
  if (ok) {
    return data.invoices;
  } else return [];
};

export const updateCustomInvoice = async (invoice: CustomInvoice) => {
  const { ok, data } = await Fetch(`invoices/custom-invoice/${(invoice._id)}`, {
    method: "PUT",
    body: JSON.stringify({ invoice }),
  });
  if (ok) {
    return true;
  }
  return false;
};

export const fetchCustomInvoiceById = async (invoiceId: string) => {
  const { ok, data } = await Fetch(`invoices/custom-invoice/${invoiceId}`, {
    method: "GET"
  });
  if (ok) {
    return data;
  } else {
    return false;
  }
}


export const deleteCustomInvoice = async (invoiceId: string) => {
  const { ok, data } = await Fetch(`invoices/custom-invoice/${(invoiceId)}`, {
    method: "DELETE"
  });
  if (ok) {
    return true;
  }
  return false;
};