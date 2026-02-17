"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowRight,
  Copy,
  MoreHorizontal,
  Printer,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteInvoice } from "@/lib/services/invoice.service";
import { revalidateClientInvoices } from "@/lib/actions/revalidateTag";
import Spinner from "../ui/custom/spinner";

export function InvoiceActions({
  invoice,
  invoiceType,
  opened,
}: {
  invoice: any;
  invoiceType: "storage" | "fulfillment";
  opened?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDeleteInvoice = async () => {
    try {
      setLoading(true);
      const deleted = await deleteInvoice(invoice._id, invoiceType);
      if (deleted) {
        await revalidateClientInvoices();
        toast.success("Item Deleted");
      } else {
        toast.error("Failed to delete, please try again");
      }
    } catch (err) {
      toast.error("Failed to delete, please try again");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 125);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={loading} className="w-full " asChild>
        <Button disabled={loading} variant="link" className="text-foreground ">
          {loading ? <Spinner /> : <MoreHorizontal />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[200px] p-0">
        <div className=" p-1.5" onClick={() => setOpen(false)}>
          <button
            onClick={() => navigator.clipboard.writeText(invoice._id)}
            className="w-full flex text-center justify-between p-2 text-sm hover:bg-secondary rounded-lg "
          >
            Copy ID <Copy size={15} />
          </button>
          {!opened && (
            <Link
              href={`/clients/${invoice.client}/invoices/${invoiceType}/${invoice._id}`}
              className="w-full flex text-center justify-between p-2 text-sm hover:bg-secondary rounded-lg "
            >
              Open <ArrowRight size={15} />
            </Link>
          )}

          <Link
            href={`/print/${invoice._id}/${invoiceType}`}
            target="_blank"
            className="w-full flex text-center justify-between p-2 text-sm hover:bg-secondary rounded-lg "
          >
            Print <Printer size={15} />
          </Link>
          <button
            onClick={handleDeleteInvoice}
            className="w-full text-red-500/50 flex hover:bg-red-400/10 text-center justify-between p-2 text-sm  rounded-lg "
          >
            Delete <Trash2 size={15} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
