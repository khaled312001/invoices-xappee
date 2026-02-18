import { cache } from "react";
import { Fetch } from "../actions/fetch";

export const fetchClients = cache(async () => {
  const { ok, data } = await Fetch(`clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      tags: ["clients"],
    },
  });
  if (ok) {
    return data.clients;
  } else return [];
});

export const postNewClient = async (client: any) => {
  const { ok, data } = await Fetch(`clients/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client,
    }),
  });
  return { ok, data };
};

export const updateNewClient = async (client: any) => {
  const { ok, data } = await Fetch(`clients/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client,
    }),
  });
  return { ok, data };
};

export const deleteClient = async (name: string) => {
  const { ok, data } = await Fetch(`clients/${name}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { ok, data };
};
