import { usePathRouter } from "@/lib/hooks/usePathRouter";
import { BoxModelIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ArrowRight, Box, Check, Truck, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { InvoiceActions } from "./invoiceActions";

export default function InvoiceRow({
  invoice,
  client,
}: {
  invoice: any;
  client: string;
}) {
  const invoiceType = invoice.orders ? "fulfillment" : "storage";
  const isStorage = invoiceType === "storage";

  const { push } = usePathRouter();
  const onInvoiceClick = () => {
    push(`/${invoiceType}/${invoice._id}`, {});
  };
  return (
    <tr className="text-sm table-row grid-cols-7 ">
      <td
        onClick={onInvoiceClick}
        className="border p-2 hover:bg-gray-500/15 cursor-pointer group relative"
      >
        {invoice._id}{" "}
        <span className="hidden group-hover:inline-flex absolute right-4 mt-1">
          <ArrowRight size={17}/>
        </span>
      </td>
      <td className="border p-2">{format(invoice.from, "yyyy-MM-dd")}</td>
      <td className="border p-2">{format(invoice.to, "yyyy-MM-dd")}</td>
      <td
        className={`border p-2 ${isStorage ? "text-primary" : "text-blue-500"}`}
      >
        {isStorage ? (
          <Box strokeWidth={1.4} className=" inline-flex mr-2 -mt-1" />
        ) : (
          <Truck strokeWidth={1.4} className=" inline-flex mr-2 -mt-1" />
        )}
        {invoiceType}
      </td>
      <td className="border p-2">
        {invoice.orders ? (
          invoice.orders.length
        ) : (
          <span className="text-muted-foreground opacity-60">{`N/A`}</span>
        )}
      </td>
      <td className="border p-2">
        {invoice.services ? (
          invoice.services.length
        ) : (
          <span className="text-muted-foreground opacity-60">{`N/A`}</span>
        )}
      </td>
      <td className="border p-2">
        {invoice.items ? (
          invoice.items.length
        ) : (
          <span className="text-muted-foreground opacity-60">{`N/A`}</span>
        )}
      </td>
      <td className="border p-2">
        {invoice.createdAt && format(invoice.createdAt, "yyyy-MM-dd")}
      </td>
      {/* <td className="border p-2">
        {invoice.printed ? (
          <Check className="text-green-500" />
        ) : (
          <X className="text-red-500" />
        )}
      </td> */}
      <td className="border p-2 z-20 relative">
        <InvoiceActions invoiceType={invoiceType} invoice={invoice} />
      </td>
    </tr>
  );
}
