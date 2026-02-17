import { format } from "date-fns";
import { Fetch } from "../actions/fetch";

export const fetchOrderById = async (id: string) => {
  const { ok, data } = await Fetch(`orders/import/${id}`, {
    cache: "no-store",
  });
  if (ok) {
    return data.order;
  } else return {};
};

export const fetchOrdersWithRange = async (
  fromDate: Date,
  toDate: Date,
  channelIds: number[]
) => {
  if (!fromDate || !toDate) return;
  const from = format(fromDate, "yyyy-MM-dd");
  const to = format(toDate, "yyyy-MM-dd");
  const { ok, data } = await Fetch(`orders/import`, {
    method: "POST",
    body: JSON.stringify({ from, to, channelIds }),
    cache: "no-store",
  });
  if (ok) {
    return data.orders as any[];
  } else {
    return [];
  }
};

export const softDeleteOrder = async (_id: string) => {
  const { ok, data } = await Fetch(`orders/soft-delete`, {
    method: "POST",
    body: JSON.stringify({ _id }),
  });
  if (ok) {
    return data.order;
  } else {
    return {};
  }
};

export const fethSoftDeletedOrders = async () => {
  const { ok, data } = await Fetch(`orders/softDeleted`);
  if (ok) {
    return data.orders as any[];
  } else {
    return [];
  }
};

export const restoreOrderFromTrash = async (_id: string) => {
  const { ok, data } = await Fetch(`orders/restore`, {
    method: "POST",
    body: JSON.stringify({ _id }),
  });
  if (ok) {
    return data.order;
  } else {
    return {};
  }
};

export const fixOneOrder = async (id: string) => {
  const { data, ok } = await Fetch(`orders/fix/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (ok) {
    return data.order;
  } else {
    return {};
  }
};

export const updateOrder = async (id: string, values: any) => {
  console.log("values", JSON.stringify({ values }));
  const { ok, data } = await Fetch(`orders/${id}`, {
    method: "PUT",
    cache: "no-store",
    body: JSON.stringify({ values }),
  });
  if (ok) {
    return true;
  } else {
    return false;
  }
};
