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
import { CustomInvoiceItem, FulfillmentInvoice } from "@/types/invoice";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function CustomInvoiceItemsBreakDown({
  items,
}: {
  items: CustomInvoiceItem[];
}) {
  const [show, setShow] = useState(false);

  return (
    <Card
      className={`${show ? "h-auto" : "h-[30vh]"
        }  mb-8 border-transparent rounded-lg overflow-hidden transition-all ease-in-out duration-300`}
    >
      <CardHeader className="flex justify-between items-center flex-row">
        <div>
          <CardTitle className="font-medium text-lg">
            Invoice Orders Breakdown
          </CardTitle>
          <CardDescription>
          A break down of the items in invoice.
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
            <div className="grid grid-cols-6 font-bold text-left pb-2">
            <p className="col-span-3 w-full">Description</p>
              <p className="w-full">Qty</p>
              <p className="w-full">Price</p>
              <p className="w-full">Total</p>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-6">
               
               <p className="text-left py-2 col-span-3 w-full">{item.description}</p>
                {/* <p className="text-left py-2   lowercase w-full">
                  {order.carrier.trim()}
                </p> */}
                <p className="text-left py-2">
                  {item.qty}
                  </p>
                {/* <p className="text-left py-2 text-nowrap">
                  {(order.totalWeight / 1000).toFixed(2)} KG
                </p> */}
                <p className="text-left py-2">
                  £
                  {(item.price).toFixed(2)}
                </p>
                <p className="text-left py-2 ">
                  £
                  {(item.qty * item.price).toFixed(2)}
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
