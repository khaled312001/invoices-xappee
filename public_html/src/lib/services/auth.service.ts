import { cache } from "react";
import { Fetch } from "../actions/fetch";

export const loginPassword = async (email: string, password: string) => {
  const { data, status } = await Fetch(`auth/login/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return { status, data };
};

export const authCallback = async (
  email: string,
  displayName: string,
  image: string
) => {
  const {status, data} = await Fetch(`auth/callback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, displayName, image }),
  });
  return { status, data };
};

export const signout = async (token: string) => {
  const {ok} = await Fetch(`auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return ok;
};

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
  const { ok, data } = await Fetch(`users/`+id, {
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