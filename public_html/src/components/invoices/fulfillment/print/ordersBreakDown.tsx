"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FulfillmentInvoice } from "@/types/invoice";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function OrdersBreakdown({
  orders,
}: {
  orders: FulfillmentInvoice["orders"];
}) {
  const [show, setShow] = useState(false);

  return (
    <Card
      className={`${show ? "h-auto" : "h-[40vh]"
        }  mb-8 border-transparent rounded-lg overflow-hidden transition-all ease-in-out duration-300`}
    >
      <CardHeader className="flex justify-between items-center flex-row">
        <div>
          <CardTitle className="font-medium text-lg">
            Invoice Orders Breakdown
          </CardTitle>
          <CardDescription>
            A break down of the fulfillment invoice by unqiue orders used to
            ship orders.
          </CardDescription>
        </div>
        <Button
          onClick={() => setShow((prev) => !prev)}
          className="gap-2"
          variant="outline"
        >
          {show ? "Hide" : "Show"} Breakdown{" "}
          {show ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="px-0 py-0">
        {/* <ScrollArea className="h-[65vh] "> */}
          <div className="pt-4 px-10">
            <div className="grid grid-cols-9 font-bold text-left pb-2">
              <p className="w-fit">Date</p>
              <p className="w-full">Order ID</p>
              {/* Uncomment if you want to show Carrier */}
              {/* <p className="w-full">Carrier</p> */}
              <p className="w-full">Channel</p>
              {/* <p className="w-full">Total Weight</p> */}
              <p className="w-full">Handling</p>
              <p className="w-full">Packaging</p>
              <p className="w-full">Postage</p>
              <p className="w-full pr-2">Amazon Prep Charge</p>
              <p className="w-full">Surge</p>
              <p className="w-full">Total</p>
            </div>
            {orders.map((order, index) => (
              <div key={order.id} className="grid grid-cols-9">
                <p className="text-left py-2  lowercase w-fit">
                  {format(order.date, "dd/MM/yyyy")}
                </p>
                <p className="text-left py-2 placeholder:lowercase w-full">{order.id}</p>
                {/* <p className="text-left py-2   lowercase w-full">
                  {order.carrier.trim()}
                </p> */}
                <p className="text-left py-2 lowercase w-full">
                  {order.channel ?? ''}
                </p>
                {/* <p className="text-left py-2 text-nowrap">
                  {(order.totalWeight / 1000).toFixed(2)} KG
                </p> */}
                <p className="text-left py-2 pl-4">
                  £
                  {(order.charges.handling).toFixed(2)}
                </p>
                <p className="text-left py-2 ">
                  £
                  {(order.charges.packaging).toFixed(2)}
                </p>
                <p className="text-left py-2 ">
                  £
                  {(order.charges.postage).toFixed(2)}
                </p>
                <p className="text-left py-2  pr-2">
                  £
                  {(order.charges.prepCharge).toFixed(2)}
                </p>
                <p className="text-left py-2 ">
                  £
                  {(order.charges.surge).toFixed(2)}
                </p>
                <p className="text-left font-semibold  py-2 ">
                  £
                  {(
                    order.charges.handling +
                    order.charges.packaging +
                    order.charges.postage +
                    order.charges.prepCharge +
                    order.charges.surge
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          {/* <ScrollBar orientation="vertical" /> */}
        {/* </ScrollArea> */}
      </CardContent>
    </Card>
  );
}
