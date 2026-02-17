"use server";
import { getCurrentSession } from "../auth";

export const Fetch = async (
  endpoint: string,
  options: RequestInit = {},
  file?: "file" | undefined,
  json: boolean = true
): Promise<any> => {
  let token = null;
  const session = await getCurrentSession();
  // @ts-ignore
  const headers = json ?{
    Authorization: `Bearer ${session?.userToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  } : {
    Authorization: `Bearer ${session?.userToken}`,
    ...options.headers,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await res.json();

  return { status: res.status, ok: res.ok, data };
};
