"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Breakdown({ items , storageStartMonth}: { items: any , storageStartMonth: Number}) {
  const [show, setShow] = useState(false);
  return (
    <Card
      className={`${
        show ? "h-[90vh]" : "h-[40vh]"
      } mb-8 border-transparent rounded-lg overflow-hidden transition-all ease-in-out duration-300`}
    >
      <CardHeader className="flex justify-between items-center flex-row">
        <div>
          <CardTitle className="font-medium text-lg">
            Invoice Breakdown
          </CardTitle>
          <CardDescription>
            A break down of all items stored in our warehouse.
          </CardDescription>
        </div>
        <Button
          onClick={() => setShow((prev) => !prev)}
          className="gap-2"
          variant="secondary"
        >
          {show ? "Hide" : "Show"} Breakdown{" "}
          {show ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="px-0 py-0">
        <ScrollArea className="h-[65vh] ">
          <table className="w-full ">
            <thead>
              <tr className="border-b">
                <th className="text-left  py-2 px-6 text-nowrap text-muted-foreground ">Name</th>
                <th className="text-left py-2 px-6 text-nowrap text-muted-foreground ">SKU</th>
                <th className="text-left py-2 px-6 text-nowrap text-muted-foreground ">Quantity</th>
                <th className="text-left py-2 px-6 text-nowrap text-muted-foreground ">Total weight {`(kg)`}</th>
                <th className="text-right py-2 px-6 text-nowrap text-muted-foreground ">Per week</th>
                <th className="text-right py-2 px-6 text-nowrap text-muted-foreground ">Per month</th>
                {!storageStartMonth ? <th className="text-right py-2 px-6 text-nowrap text-muted-foreground ">upfront deposit</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.sku} className="border-b">
                  <td className="text-left py-2 px-6 text-sm lowercase">
                    {item.name?.slice(0, 40)}..
                  </td>
                  <td className="text-left py-2 px-6">{item.sku}</td>
                  <td className="text-left py-2 px-6">{item.qty}</td>
                  <td className="text-left py-2 px-6">
                    {((item.qty * item.weight) / 1000).toFixed(2)}
                  </td>
                  <td className="text-left py-2 px-6 ">
                    £{item.weeklyFee.toFixed(2)}
                  </td>
                  <td className="text-left py-2 px-6 ">
                    £{item.montlyFee.toFixed(2)}
                  </td>
                  {!storageStartMonth ?  <td className="text-left py-2 px-6 ">
                    £{item.montlyFee.toFixed(2)}
                  </td> : null }
                </tr>
              ))}
            </tbody>
          </table>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
