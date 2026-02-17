"use server";
import { toast } from "sonner";
import { getCurrentSession } from "../auth";

export const UploadFileToServer = async (
  FileData: FormData,
  endpoint: string
) => {
    const session = await getCurrentSession();
    const headers = {
      Authorization: `Bearer ${session?.userToken}`,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`,
      {
        method: "POST",
        body: FileData,
        headers,
        cache: "no-cache",
      }
    );
    const ok = res.ok;
    const data = await res.json();
          return { ok, data };
    
};
