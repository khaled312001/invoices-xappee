import React from "react";
import { Dot } from "lucide-react";

export default function InvoiceServicesTable({
  services,
}: {
  services: any[];
}) {
  return (
    <ul className="space-y-2 text-lg print:text-base m-10 print:m-4 rounded-2xl ">
      <li className="font-bold text-muted-foreground grid grid-cols-8">
        <h2 className="ml-8 print:ml-0 col-span-2">Service</h2>
        <h2 className="pl-10 ">Shipping</h2>
        <h2 className="pl-10">Surge</h2>
        <h2 className="pl-10">Handling</h2>
        <h2 className="pl-10">Packaging</h2>
        <h2 className="pl-10">Prep</h2>
        <h2 className="pl-10">Subtotal</h2>
      </li>
      {Object.entries(services)?.map(([service, orderDetails]: any) => (
        <li
          key={service}
          className="grid grid-cols-8 border-t print-border-t-0 py-4 print-py-2"
        >
          <p className="font-bold flex items-center gap-2 col-span-2 ">
            <Dot className="text-primary print:hidden" size={25} />
            {orderDetails.service}
          </p>
          <p className="pl-10">
            £{parseFloat(orderDetails.charges.postage).toFixed(2)}
          </p>
          <p className="pl-10">
            £{parseFloat(orderDetails.charges.surge).toFixed(2)}
          </p>
          <p className="pl-10">
            £{parseFloat(orderDetails.charges.handling).toFixed(2)}
          </p>
          <p className="pl-10">
            £{parseFloat(orderDetails.charges.packaging).toFixed(2)}
          </p>
          <p className="pl-10">
            £{parseFloat(orderDetails.charges.prepCharge).toFixed(2)}
          </p>
          <p className="pl-10">£{parseFloat(orderDetails.total).toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}
