"use server";
import { getCurrentSession, refreshBackendToken } from "../auth";

const parseResponse = async (res: Response) => {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return { message: await res.text() };
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const Fetch = async (
  endpoint: string,
  options: RequestInit = {},
  file?: "file" | undefined,
  json: boolean = true
): Promise<any> => {
  const session = await getCurrentSession();
  const buildHeaders = (token?: string | null) =>
    json
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers,
        }
      : {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        };

  const request = (token?: string | null) => fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`, {
    ...options,
    credentials: "include",
    headers: buildHeaders(token),
  });

  let res = await request(session?.userToken);

  if (res.status === 401) {
    const refreshedToken = await refreshBackendToken(session);
    if (refreshedToken) {
      res = await request(refreshedToken);
    }
  }

  const data = await parseResponse(res);

  return { status: res.status, ok: res.ok, data };
};
