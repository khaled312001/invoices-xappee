"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { Input } from "@/components/ui/input";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { useSelector } from "react-redux";
import { Search, SearchIcon, Truck } from "lucide-react";

export default function OrdersSearch() {
  const searchKey = "query";
  const { ordersCount } = useSelector(selectOrderSlice);
  const { getParam, setParam } = useSearchParams();
  const searchQuery = getParam(searchKey);
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    setParam(searchKey, query);
  }, [query, setParam, searchKey]);

  return (
    <>
      {ordersCount && ordersCount > 0 ? (
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search.."
            className="max-w-[225px] rounded-xl bg-muted text-lg font-normal pr-8 text-foreground focus:outline-none"
          />
          <SearchIcon
            size={15}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
      ) : (
        <h1 className="text-lg flex items-center gap-2 ">
          <Truck size={20} /> Fulfillment Orders
        </h1>
      )}
    </>
  );
}
