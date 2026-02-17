import React from "react";
import { format, formatDate, getWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, MailCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchCustomInvoiceById, fetchInvoiceById } from "@/lib/services/invoice.service";
import { Separator } from "@/components/ui/separator";
import OrdersBreakdown from "@/components/invoices/fulfillment/print/ordersBreakDown";
import { RadialChart } from "@/components/charts/radialChart";
import ServiceBreakdown from "@/components/invoices/fulfillment/print/serviceBreakdown";
import { Metadata, ResolvingMetadata } from "next";
import { CustomInvoice, FulfillmentInvoice } from "@/types/invoice";
import { SendMailDialogCustomInvoice } from "@/components/invoices/email/sendMailDialogCustomInvoice";
import { render } from "@react-email/components";
import FulfillmentInvoiceEmail from "../../../../../emails/fulfillment-invoice";
import { enUS } from 'date-fns/locale';
import GenerateInvoicePDF from "@/components/invoices/email/printPdfBtn";
import PrintPdfBtn from "@/components/invoices/email/printPdfBtn";
import CustomInvoiceItemsBreakDown from "@/components/invoices/fulfillment/invoice/customInvoiceItemsBreakDown";
import { CustomInvoiceContentForPDF } from "@/components/invoices/email/pdfInvoiceCustomInvoice";
import PrintPdfBtnCustomInvoice from "@/components/invoices/email/printPdfBtnCustomInvoice";
import CustomInvoiceEmail from "../../../../../emails/custom-invoice";
import { getCurrentSession } from "@/lib/auth";


// export async function generateMetadata(
//   {
//     params,
//     searchParams,
//   }: { params: { id: string }; searchParams: URLSearchParams },
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const invoice: FulfillmentInvoice = await fetchInvoiceById(
//     params.id,
//     "fulfillment"
//   );

//   if (!invoice || !invoice.client)
//     return {
//       title: " Xappee",
//     };
//   return {
//     title: `Fulfillment Invoice ${invoice.client}`,
//   };
// }

export default async function CusstomInvoicePage({ params }: { params: { invoiceId: string } }) {
  console.log("invoiceId", params.invoiceId);
  const { invoice, client, sender }: { invoice: CustomInvoice, client: any, sender: any } = await fetchCustomInvoiceById(params.invoiceId);
  // const calculateSubtotal = () => {
  //   return invoice.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  // };

  // const calculateDiscount = () => {
  //   if (invoice.discountType === 'percentage') {
  //     return (calculateSubtotal() * (invoice.discount / 100)).toFixed(2);
  //   } else {
  //     return invoice.discount.toFixed(2);
  //   }
  // };

  // const calculateTax = (total) => {
  //   return ((total * (invoice.taxRate / 100))).toFixed(2);
  // };


  // const calculateTotal = () => {
  //   const subtotal = calculateSubtotal();
  //   const discount = parseFloat(calculateDiscount());
  //   const totalAfterDiscount = subtotal - discount;
  //   const tax = parseFloat(calculateTax(totalAfterDiscount));
  //   return (totalAfterDiscount + tax).toFixed(2);
  // };

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-[68vh]">
        <p className="text-lg text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  const session = await getCurrentSession();
  const user = session?.user || null;

  const emailHtml = render(CustomInvoiceEmail({ invoice, client, sender }));
  return (
    <main className="mx-auto w-full max-w-[60%]">
      <Card className="border-none flex justify-between items-start p-6 mb-6">
        <div>
          <h2 className="text-2xl  font-medium">INV-{invoice._id}</h2>
        </div>
        <div>
          <h2 className="text-base text-muted-foreground">
            {format(new Date(invoice.date), "MMM dd, yyyy")}
          </h2>
        </div>
      </Card>
      <Card className="mb-8 p-1  border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-4">Summary</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="mt-6 px-0 space-y-6">
          <div className="px-6 gap-[5vw] grid grid-cols-2 ">
            <div className="space-y-2">
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Sender Email</span>{" "}
                {sender.email}
              </p>
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Sender Name</span>{" "}
                {sender.busineesName ?? sender.name}
              </p>
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Invoice Date</span>{" "}
                {format(new Date(invoice.date), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Client Name</span>{" "}
                {invoice.client}
              </p>
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Client Email</span>{" "}
                {client.email}
              </p>
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">Type</p>{" "}
                <p className="flex gap-10">
                  <span className="text-red-500 font-medium">
                    Custom Invoice
                  </span>
                </p>
              </div>
            </div>

          </div>

        </CardContent>
      </Card>

      <CustomInvoiceItemsBreakDown items={invoice.items} />

      <Card className="mb-8 p-1  border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-4">Totals</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="mt-6 px-0 space-y-6">

          <div className="px-6">
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Items</span>{" "}
              {invoice.itemsNo}
            </p>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">SubTotal</span>{" "}
              £{invoice.subtotal.toFixed(2)}
            </p>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Tax Rate (%)</span>{" "}
              {invoice.taxRate.toFixed(2)}
            </p>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Discount {invoice.discount > 0 ? invoice.discountType == "fixed" ? "(Fixed)" : "(Percentage)" : ""}</span>{" "}
              {invoice.discount.toFixed(2)}
            </p>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Total</span>{" "}
              £{invoice.total.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-row gap-10 justify-center items-center mt-5">
            {user && user.role === "admin" ? <SendMailDialogCustomInvoice
              emailHtml={emailHtml}
              data={invoice}
              client={client}
              sender={sender}
            >
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2" size="lg">
                <MailCheck size={20} className="relative -top-[1px]" /> Send by
                Email
              </Button>
            </SendMailDialogCustomInvoice> : null}
            <PrintPdfBtnCustomInvoice invoice={invoice} client={client} sender={sender} />

          </div>

        </CardContent>
      </Card>

    </main>
  );
}
