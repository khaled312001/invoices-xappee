"use client";

import { Box, Dot, Truck } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { useSearchParams } from "@/lib/hooks/useSearchParams";

export default function ClientInvoicesFilters() {
  const { getParam, setParam } = useSearchParams();
  const query = getParam("q");
  const type = getParam("type") || "all";

  return (
    <div className="flex gap-4 items-center">
      {/* <Input
        placeholder="Search.."
        className="max-w-[325px] rounded-xl"
        value={query}
        onChange={(e) => setParam("q", e.target.value)}
      /> */}
      {/* <Dot className="text-primary" /> */}
      <div className="flex gap-2">
        <button
          onClick={() => setParam("type", "all")}
          className={`flex h-8 gap-2 items-center rounded-xl py-1 px-2 text-sm ${
            type === "all" ? "bg-primary" : " bg-secondary"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setParam("type", "fulfillment")}
          className={`flex h-8 gap-2 items-center rounded-xl py-1 px-2 text-sm ${
            type === "fulfillment" ? "bg-primary" : " bg-secondary"
          }`}
        >
          <Box strokeWidth={1.4} size={18} />
          Fulfillemnt
        </button>
        <button
          onClick={() => setParam("type", "storage")}
          className={`flex h-8 gap-2 items-center rounded-xl py-1 px-2 text-sm ${
            type === "storage" ? "bg-primary" : " bg-secondary"
          }`}
        >
          <Truck strokeWidth={1.4} size={18} />
          Storage
        </button>
      </div>
    </div>
  );
}
