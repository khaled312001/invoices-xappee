"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const usePathRouter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = (
    path: string,
    { ignoreParams = false, ignorePath = false } = {}
  ) => {
    let newPath = ignorePath ? "" : pathname;
    if (path) newPath += `/${path}`;
    if (!ignoreParams && searchParams.toString()) newPath += `?${searchParams}`;

    router.push(newPath);
  };

  return { push };
};
