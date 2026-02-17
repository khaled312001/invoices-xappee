import React from "react";
import { CardTitle } from "./orderCard";
import { ShippedStatus } from "./customFields";
import { Dot } from "lucide-react";
import { NewItemFromSku } from "./newItemFromsku";

function extractNumber(str: string) {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

export default function OrderItemList({
  clients,
  channelSales,
  id,
}: {
  clients:any[]
  channelSales: any[];
  id: string;
}) {
  const itemsLength = channelSales.length;
  return (
    <section
      className={`space-y-2 col-span-2  max-h-[125px] overflow-y-auto pretty-scrollbar`}
    >
      {itemsLength > 1 && (
        <p className="font-bold text-xs flex items-center -ml-2">
          <Dot size={20} className="text-primary" />
          {itemsLength} {itemsLength > 1 ? "Items" : "Item"}
        </p>
      )}
      <ol className="grid gap-2">
        {channelSales.map((sale: any, i: number) => {
          // const sku = sale.sku as string;
          // const isBundle =
          //   sku.includes("_x") ||
          //   sku.includes("_X") ||
          //   sku.includes("x") ||
          //   sku.includes("X");

          // const bundeledQty = isBundle
          //   ? sale.sku.split("x")[1] || sale.sku.split("X")[1]
          //   : null;

          return (
            <li key={i} className="">
              <p className="text-xs flex items-start">
                {itemsLength > 1
                  ? `${i + 1}. ` + sale.customItemTitle
                  : sale.customItemTitle}
              </p>
              <div className="grid grid-cols-2 mt-1">
                <div>
                  <p className="flex items-center gap-2">
                    <CardTitle>SKU</CardTitle>
                    {sale.sku}
                    <NewItemFromSku
                    clients={clients}
                      problem={!sale.weight || !sale.class ? true : false}
                      id={id}
                      item={sale}
                    />
                  </p>
                  <p>
                    <CardTitle>tracking number</CardTitle>
                    {sale.trackingNumber}
                  </p>
                  <ShippedStatus status={sale.orderStatus} />
                </div>
                <div>
                  <div>
                    <CardTitle>weight</CardTitle>
                    {sale.weight}
                  </div>
                  <div>
                    <CardTitle>quantity</CardTitle>
                    {sale.quantityPurchased}
                  </div>
                  {/* {isBundle && !isNaN(extractNumber(bundeledQty)) && (
                    <div>
                      <CardTitle>Detected bundeled items</CardTitle>x
                      {extractNumber(bundeledQty)}
                    </div>
                  )} */}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
