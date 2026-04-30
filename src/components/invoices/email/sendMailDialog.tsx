"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Fetch } from "@/lib/actions/fetch";
import { updateInvoice } from "@/lib/services/invoice.service";
import { FulfillmentInvoice, StorageInvoice } from "@/types/invoice";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { InvoiceContentForPDF } from "./pdfInvoice";
import html2pdf from 'html2pdf.js';

export function SendMailDialog(props: {
  data: StorageInvoice | FulfillmentInvoice;
  children: ReactNode;
  type: "storage" | "fulfillment";
  emailHtml: any;
}) {
  const [recipient, setRecipient] = useState(props.data.clientEmail);
  const [subject, setSubject] = useState("FBX INVOICE REMINDER");
  const router = useRouter();


  const handleSendMail = async () => {
    try {
      const toastId = toast.loading("Loading...");
      let invoiceContent = "";

      if (props.type === "fulfillment") {
        const invoice = props.data as FulfillmentInvoice;
        invoiceContent = InvoiceContentForPDF(invoice);
      } else {
        // For storage, use the pre-rendered email HTML for the PDF
        invoiceContent = props.emailHtml;
      }

      const element = document.createElement('div');
      element.innerHTML = invoiceContent;
  
      const options = {
        margin: 7,
        filename: `Invoice_${props.data._id}.pdf`,
        html2canvas: { dpi: 72, letterRendering: true, useCORS: true },
        jsPDF: {
          orientation: 'portrait',
          format: 'a4'
        },
        pagebreak: { mode: ['css'] }
      };

      const pdfBlob = await html2pdf().from(element).set(options).output('blob');
  
      // Send the PDF blob to the server via API
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `Invoice_${props.data._id}.pdf`);
  
      const savePdfResponse = await Fetch('invoices/save-pdf', {
        method: 'POST',
        body: formData
      }, undefined, false);
  
      if (savePdfResponse.ok) {
        const { ok, data } = await Fetch("invoices/send-email", {
          method: "POST",
          body: JSON.stringify({
            userEmail: recipient,
            invoice: props.data,
            recipient,
            subject,
            emailHtml: props.emailHtml,
          }),
        });
  
        if (ok) {
          toast.success("The invoice email has been sent.", { id: toastId });
          await updateInvoice(props.data._id, props.type, {
            lastMessageId: data.messageId,
            emailedDate: new Date().toISOString(),
          });
          
          setTimeout(() => {
            router.refresh();
          }, 300);
        } else {
          toast.error("Failed to send the invoice email.", { id: toastId });
        }
      } else {
        toast.error("Failed to generate and save PDF.", { id: toastId });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong, Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Your are mailing this invoice to {recipient}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will send the currently open
            invoice to the email at the top.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <br />
        <AlertDialogFooter className="sm:justify-between">
          <div className="relative">
            <p className="text-xs font-normal pl-1 absolute -top-5 -left-2 text-nowrap z-10 bg-background p-0.5">
              Chagne the default subject {`(Optional)`}
            </p>
            <Input
              className="w-fit"
              defaultValue={subject}
              onChange={(e) => setSubject(e.target.value.trim().toUpperCase())}
            />
          </div>
          <div className="flex items-center gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendMail}
              className="bg-blue-600 hover:bg-blue-700 gap-1"
            >
              Send <Send size={15} />
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
