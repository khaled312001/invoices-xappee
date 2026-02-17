import { Dot } from "lucide-react";
import React from "react";

export default function StorageInvoiceMetadata({
  from,
  to,
  client,
}: {
  from: string;
  to: string;
  client: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm  text-muted-foreground -mt-1 text-normal">
      <p className="text-medium text-base">{client}</p>
      <Dot size={18} className="text-primary" />
      <p>From {from}</p>
      <Dot size={18} className="text-primary" />
      <p>To {to}</p>
    </div>
  );
}
