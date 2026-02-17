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
import { fetchInvoiceById } from "@/lib/services/invoice.service";
import { Separator } from "@/components/ui/separator";
import OrdersBreakdown from "@/components/invoices/fulfillment/print/ordersBreakDown";
import { RadialChart } from "@/components/charts/radialChart";
import ServiceBreakdown from "@/components/invoices/fulfillment/print/serviceBreakdown";
import { Metadata, ResolvingMetadata } from "next";
import { FulfillmentInvoice } from "@/types/invoice";
import { SendMailDialog } from "@/components/invoices/email/sendMailDialog";
import { render } from "@react-email/components";
import FulfillmentInvoiceEmail from "../../../../../emails/fulfillment-invoice";
import { enUS } from 'date-fns/locale';
import GenerateInvoicePDF from "@/components/invoices/email/printPdfBtn";
import PrintPdfBtn from "@/components/invoices/email/printPdfBtn";

export async function generateMetadata(
  {
    params,
    searchParams,
  }: { params: { id: string }; searchParams: URLSearchParams },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const invoice: FulfillmentInvoice = await fetchInvoiceById(
    params.id,
    "fulfillment"
  );

  if (!invoice || !invoice.client)
    return {
      title: " Xappee",
    };
  return {
    title: `Fulfillment Invoice ${invoice.clientBusinessName ?? invoice.client}`,
  };
}

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice: FulfillmentInvoice = await fetchInvoiceById(
    params.id,
    "fulfillment"
  );

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-[68vh]">
        <p className="text-lg text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  const emailHtml = render(FulfillmentInvoiceEmail({ invoice }));
  return (
    <main>
      <Card className="border-none flex justify-between items-start p-6 mb-6">
        <div>
          <h2 className="text-2xl  font-medium">INV-{invoice._id}</h2>
          <span className="text-sm font-medium text-green-500">Paid</span>
        </div>
        <div>
          {/* <h1 className="text-3xl font-bold">
            £{invoice.totals.total.toFixed(2)}
          </h1> */}
          <h2 className="text-base text-muted-foreground">
            {format(new Date(invoice.from), "dd.MM.yy", { locale: enUS, weekStartsOn: 1 })} -{" "}
            {format(new Date(invoice.to), "dd.MM.yy", { locale: enUS, weekStartsOn: 1 })}
          </h2>
          <h2 className="text-base text-muted-foreground">
            Week {getWeek(invoice.from, { locale: enUS, weekStartsOn: 1 })} -{" "}
            {getWeek(invoice.to, { locale: enUS, weekStartsOn: 1 })}
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
                <span className="text-muted-foreground">Currency</span> GBP
              </p>

              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Start Date</span>{" "}
                {format(new Date(invoice.from), "dd.MM.yy", { locale: enUS, weekStartsOn: 0 })}
              </p>

              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Billing</span> Send
                Invoice
              </p>
              <p className="grid  grid-cols-2 text-nowrap ">
                <span className="text-muted-foreground ">Invoice ID</span> INV-
                {invoice._id}
              </p>
            </div>
            <div className="space-y-2">
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Email</span>{" "}
                <span className="underline">{invoice.clientEmail}</span>
              </p>
              <p className="grid  grid-cols-2">
                <span className="text-muted-foreground">Name</span>{" "}
                {invoice.clientBusinessName ?? invoice.client}
              </p>
              <p className="grid grid-cols-2">
                <span className="text-muted-foreground">Bill Details</span>{" "}
                {format(new Date(invoice.createdAt), "dd MMM, yyyy, HH:mm a")}
              </p>
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">Type</p>{" "}
                <p className="flex gap-10">
                  <span className="text-red-500 font-medium">
                    Fulfillment Invoice
                  </span>
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="px-6">
            <div className="grid grid-cols-8  text-muted-foreground ">
              <p>Total Postage</p>
              <p>Total Surge</p>
              <p>Total Handling</p>
              <p>Total Packaging</p>
              <p>Total Amazon Prep</p>
              <p>Additional Expenses</p>
              <p>Tax(20%)</p>
              <p>FBX</p>
            </div>
            <div className="grid grid-cols-8">
              <p className="font-semibold">
                £{invoice.totals.totalPostage.toFixed(2)}
              </p>
               <p className="font-semibold">
                £{invoice.totals.totalSurge.toFixed(2)}
              </p>
               <p className="font-semibold">
                £{invoice.totals.totalHandling.toFixed(2)}
              </p>
             <p className="font-semibold">
                £{invoice.totals.totalPackaging.toFixed(2)}
              </p>
               <p className="font-semibold">
                £{invoice.totals.totalPrep.toFixed(2)}
              </p>
              <p className="font-semibold">
                £{invoice.expenseValue.toFixed(2)}
              </p>
                <p className="font-semibold">
                £{invoice.totals.totalTax.toFixed(2)}
              </p>
              <p className="font-semibold">
                £{(invoice.expenseValue  + invoice.totals.total).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 items-center gap-2 h-[35rem] -mt-8 ">
        <Card
          className={`border-transparent rounded-lg min-h-[30rem] overflow-hidden transition-all ease-in-out duration-300`}
        >
          <CardHeader>
            <CardTitle className="font-medium text-lg">
              Invoice Services Breakdown
            </CardTitle>
            <CardDescription>
              A break down of the fulfillment invoice by unqiue services used to
              ship orders.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <ServiceBreakdown services={invoice.services} />
          </CardContent>
        </Card>
        <RadialChart
          services={invoice.services.map((service) => {
            return {
              name: service.service,
              total: service.total.toFixed(2),
              carrier: service.carrier,
            };
          })}
        />
      </div>
      <OrdersBreakdown orders={invoice.orders} />
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-4">
            Log Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full items-end justify-between">
          <ul>
            {invoice.lastMessageId ? (
              <li className="flex items-center">
                <Button
                  size="icon"
                  className="bg-green-800 hover:bg-green-800 text-white scale-[0.6] w-8 h-8"
                >
                  <Check size={20} strokeWidth={2.5} />
                </Button>
                Invoice was sent to
                <span className="font-semibold mx-1">
                  {invoice.clientEmail}
                </span>
                on
                <span className="font-semibold mx-1">
                  {formatDate(new Date(invoice.emailedDate), "MMM dd, yyyy")}
                </span>
              </li>
            ) : (
              <li className="flex items-center">
                <Button
                  size="icon"
                  className="bg-gray-800 hover:bg-gray-800 text-white scale-[0.6] w-8 h-8"
                ></Button>
                Invoice is not mailed yet.
              </li>
            )}
            <li className="flex items-center">
              <Button
                size="icon"
                className="bg-blue-800 hover:bg-blue-800 text-white scale-[0.6] w-8 h-8"
              >
                <Check size={20} strokeWidth={2.5} />
              </Button>
              Invoice was finalized
            </li>
          </ul>

          <SendMailDialog
            emailHtml={emailHtml}
            type="fulfillment"
            data={invoice}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" size="lg">
              <MailCheck size={20} className="relative -top-[1px]" /> Send by
              Email
            </Button>
          </SendMailDialog>

          <PrintPdfBtn invoice={invoice} />
        </CardContent>
      </Card>
    </main>
  );
}
