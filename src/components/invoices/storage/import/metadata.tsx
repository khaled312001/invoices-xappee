"use client";
import { useSelector } from "@/redux/store";
import React, { useEffect, useState } from "react";
import PrintInoviceLink from "../../printInvoiceLink";
import { selectStorageInvoiceSlice } from "@/redux/slices/storageInvoiceSlice/selectors";
import { SendMailDialog } from "../../email/sendMailDialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { render } from "@react-email/components";
import StorageInvoiceEmail from "../../../../../emails/storage-invoice";

export default function StoragetMetadata() {
  const { invoice } = useSelector(selectStorageInvoiceSlice);
  const [emailHtml, setEmailHtml] = useState(undefined);

  useEffect(() => {
    if (invoice) {
      setEmailHtml(render(StorageInvoiceEmail({ invoice })));
    }
  }, [invoice]);
  if (!invoice) return null;

  return (
    <div className={`flex w-full mt-2 justify-end`}>
      <div className="flex items-center  gap-1">
        {/* <SendMailDialog type="storage" emailHtml={emailHtml} data={invoice}>
          <Button variant="ghost" className="font-medium gap-2">
            <SendHorizontal size={14} />
            Send Invoice by email
          </Button>
        </SendMailDialog> */}
        <PrintInoviceLink href={`/print/${invoice._id}/storage`} />
      </div>
    </div>
  );
}
