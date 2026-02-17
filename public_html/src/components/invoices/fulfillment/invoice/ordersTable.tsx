import { useSearchParams } from "@/lib/hooks/useSearchParams";
import React from "react";

export default function InvoiceOrdersTable({ orders }: { orders: any[] }) {
  const { getParam } = useSearchParams();
  const query = getParam("q");

  orders.sort((a, b) => a.date - b.date);
  return (
    <div className="w-full overflow-y-auto">
      <div className="grid border w-full px-3">
        <ul className="sticky bg-background top-0  gap-8 w-full grid grid-cols-12 border-b text-muted-foreground font-semibold p-4">
          <li>*</li>
          <li className="col-span-2">ID</li>
          <li>Date</li>
          <li className="col-span-2">Service</li>
          <li>Postage</li>
          <li>Surge</li>
          <li>Handling</li>
          <li>Packaging</li>
          <li>Amazon Prep</li>
          <li>Subtotal</li>
        </ul>
        <ul>
          {orders
            .filter((order: any) => {
              if (query) {
                return (
                  order.id.includes(query) ||
                  order.carrier.toLowerCase().includes(query.toLowerCase())
                );
              }
              return true;
            })
            .map((order: any, i) => {
              const { packaging, handling, surge, postage ,prepCharge} = order.charges;

              return (
                <li
                  className="grid grid-cols-12 gap-8 border-b px-4 py-4"
                  key={order.id}
                >
                  <h2 className="font-semibold text-muted-foreground">{i}</h2>
                  <h2 className="col-span-2 font-semibold text-muted-foreground">
                    {order.id}
                  </h2>

                  <p className="mr-4 ">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="col-span-2">{order.service}</p>
                  <p>£{parseFloat(postage).toFixed(2)}</p>
                  <p>£{parseFloat(surge).toFixed(2)}</p>
                  <p className="">£{parseFloat(handling).toFixed(2)}</p>
                  <p>£{parseFloat(packaging).toFixed(2)}</p>
                  <p className="">£{parseFloat(prepCharge).toFixed(2)}</p>
                
                  <p>
                    £{parseFloat(postage + handling + packaging + prepCharge + surge).toFixed(2)}
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
