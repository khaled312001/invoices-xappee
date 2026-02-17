"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import OrderCard from "./orderCard";
import { ChevronUp } from "lucide-react";
import ImportOneOrder from "./importOneOrder";
import Spinner from "@/components/ui/custom/spinner";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "@/redux/store";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";
import { UploadCsvArea } from "../../upload-csv/upload-area";

export default function FilteredOrdersList({ carriers, clients }: { carriers: any, clients:any[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const category = searchParams.get("category") || null;
  const [isLoading, setIsLoading] = useState(false);

  const { orders } = useSelector(selectOrderSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(orderSlice.actions.setCarriers(carriers));
  }, [carriers]);

  useEffect(() => {
    if (searchQuery || category) {
      setIsLoading(true);
      // Simulate a delay to show the spinner, then set loading to false
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 50); // Adjust delay as needed

      return () => clearTimeout(timer);
    }
  }, [searchQuery, category]);

  if (orders.length <= 0) {
    return <p className="text-center mt-[30vh]">no orders</p>;
  }
  const filteredOrders =
    orders.length > 0
      ? orders?.filter((order: any) => {
          if (!order) return false;

          const matchesSearchQuery = searchQuery
            ? order.id?.includes(searchQuery) ||
              order.selroOrderId?.includes(searchQuery) ||
              order.shipPostalCode?.includes(searchQuery) ||
              order.trackingNumber?.includes(searchQuery)
            : true;

          // Filter by category if category is not null
          const matchesItemCategory = category
            ? order.channelSales?.some((channelSale: any) =>
                category === "shipped"
                  ? channelSale.orderStatus === "Shipped"
                  : category === "cancelled"
                  ? channelSale.orderStatus === "Canceled"
                  : category === "unshipped"
                  ? channelSale.orderStatus === "Unshipped"
                  : category === "pending"
                  ? channelSale.orderStatus === "Pending"
                  : true
              )
            : true;

          const matchOrdercategory =
            category === "missing_weight"
              ? order.totalWeight === 0
              : category === "missing_carrier"
              ? !order.carrierName && true
              : category === "missing_service"
              ? !order.shippingMethod && true
              : true;

          return (
            matchesSearchQuery && matchesItemCategory && matchOrdercategory
          );
        })
      : [];

  filteredOrders.sort((a: any, b: any) =>
    a.selroOrderId > b.selroOrderId ? 1 : -1
  );

  return (
    <>
      {isLoading ? (
        <div className="grid place-content-center mt-[40vh]">
          <Spinner />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className={"grid pb-32"}>
          <hr className="mt-1" />
          {filteredOrders.map((order: any, i: number) => (
            <OrderCard clients={clients} index={i} order={order} key={order.id} />
          ))}
          {filteredOrders.length > 20 && (
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                className="flex items-stretch gap-2 group"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top
                <ChevronUp
                  className="group-hover:-mt-3 duration-300 ease-in-out"
                  size={20}
                />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ImportOneOrder query={searchQuery} />
      )}
    </>
  );
}
