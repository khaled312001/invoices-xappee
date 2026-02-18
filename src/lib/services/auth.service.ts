import { cache } from "react";
import { Fetch } from "../actions/fetch";

// Auth functions moved to auth-actions.ts to break circular dependency


export const fetchUsers = cache(async () => {
  const { ok, data } = await Fetch(`users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      tags: ["users"],
    },
  });
  return data.users;
});

export const deleteUser = async (name: string) => {
  const { ok, data } = await Fetch(`users/${name}/account/hard`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { ok, data };
};

export const updateUser = async (newUser: any, id: string) => {
  console.log("user", newUser);
  const { ok, data } = await Fetch(`users/` + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newUser,
    }),
  });
  return { ok, data };
};