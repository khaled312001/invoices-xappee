"use client"
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { useCallback } from "react";

// Custom hook to manage URL search parameters
export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParam = useCallback(
    (key: string, value: string) => {
      if (searchParams.get(key) !== value) {
        // Only update if different
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        router.replace(`${pathname}?${params.toString()}`, undefined);
      }
    },
    [searchParams, pathname, router]
  );

  // Optimized removeParam to check if the key exists before removing
  const removeParam = useCallback(
    (key: string) => {
      if (searchParams.has(key)) {
        // Only update if key exists
        const params = new URLSearchParams(searchParams);
        params.delete(key);
        router.replace(`${pathname}?${params.toString()}`, undefined);
      }
    },
    [searchParams, pathname, router]
  );

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key) || "";
    },
    [searchParams]
  );

  return { setParam, removeParam, getParam };
};
