import React from "react";
import { format, formatDate, getWeek } from "date-fns";
import { fetchInvoiceById } from "@/lib/services/invoice.service";
import { ArrowLeft, Check, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Metadata, ResolvingMetadata } from "next";
import { StorageInvoice } from "@/types/invoice";
import { SendMailDialog } from "@/components/invoices/email/sendMailDialog";
import Breakdown from "@/components/invoices/storage/print/breakdown";
import StorageInvoiceEmail from "../../../../../emails/storage-invoice";
import { render } from "@react-email/components";
import { enUS } from "date-fns/locale";


export async function generateMetadata(
  {
    params,
    searchParams,
  }: { params: { id: string }; searchParams: URLSearchParams },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const invoice: StorageInvoice = await fetchInvoiceById(params.id, "storage");

  return {
    title: `Storage Invoice ${invoice.client}`,
  };
}

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await fetchInvoiceById(params.id, "storage");
  const emailHtml = render(StorageInvoiceEmail({ invoice }))
  
  const startDate = new Date(`${invoice.from}T00:00:00`);
  const endDate = new Date(`${invoice.to}T00:00:00`);
  
  const formattedStartDate = format(startDate, 'dd.MM.yy');
  const formattedEnddate = format(endDate, 'dd.MM.yy');

  return (
    <main>
      <Card className="border-none flex justify-between items-start p-6 mb-6">
        <div>
          <h2 className="text-2xl  font-medium">INV-{invoice._id}</h2>
          <span className="text-sm font-medium text-green-500">Paid</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            £{invoice.weeklySubTotal.toFixed(2)}/WK
          </h1>
          <h2 className="text-base font-normal text-right text-muted-foreground">
            £{invoice.monthlySubtotal.toFixed(2)}/MONTH
          </h2>
        </div>
      </Card>

      <Card className="mb-8 p-1  border-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-wide font-medium">
            Summary
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-2 gap-[5vw] mt-6">
          <div>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Currency</span> GBP
            </p>

            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Date</span>{" "}
              {formattedStartDate} - {formattedEnddate}
            </p>

            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Week </span>{" "}
              {getWeek(`${invoice.from}T00:00:00`, { locale: enUS, weekStartsOn: 1 })} -{" "}
              {getWeek(`${invoice.to}T00:00:00`, { locale: enUS, weekStartsOn: 1 })}
              </p>

            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Billing</span> Send
              Invoice
            </p>
            <p className="grid  grid-cols-2 text-nowrap ">
              <span className="text-muted-foreground ">Invoice ID</span> INV-
              {invoice._id}
            </p>
            <br />
            <p className="mt-4 grid grid-cols-2 text-nowrap">
              <span className="text-muted-foreground ">Note</span> Thanks for
              dealing with xappee, Happy Trading!
            </p>
          </div>
          <div>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Email</span>{" "}
              {invoice.clientEmail}
            </p>
            <p className="grid  grid-cols-2">
              <span className="text-muted-foreground">Name</span>{" "}
              {invoice.clientBusinessName ?? invoice.client}
            </p>
            <p className="grid grid-cols-2">
              <span className="text-muted-foreground">Bill Details</span>{" "}
              {format(new Date(0), "dd MMM, yyyy, HH:mm a")}
            </p>
            <div className="grid grid-cols-2">
              <p className="text-muted-foreground">Type</p>{" "}
              <p className="flex gap-10">
                <span className="text-blue-500 font-medium">
                  Storage Invoice
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Breakdown items={invoice.items} storageStartMonth = {invoice.storageStartMonth} />

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
                  {invoice.client}@gmail.com
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
          <SendMailDialog type="storage" emailHtml={emailHtml} data={invoice}>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" size="lg">
              <MailCheck size={20} className="relative -top-[1px]" /> Send by
              Email
            </Button>
          </SendMailDialog>
        </CardContent>
      </Card>
    </main>
  );
}
