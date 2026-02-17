"use client";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { useSelector } from "@/redux/store";
import React, { useEffect, useMemo, useState } from "react";
import OrderCategories from "./orders/orderCategories";
import ToggleView from "../invoice/toggleView";
import { Dot, SendHorizontal } from "lucide-react";
import PrintInoviceLink from "../../printInvoiceLink";
import { SendMailDialog } from "../../email/sendMailDialog";
import { Button } from "@/components/ui/button";
import FulfillmentInvoiceEmail from "../../../../../emails/fulfillment-invoice";
import { render } from "@react-email/components";

export default function FulfillmentMetadata() {
  const { ordersCount, orders, invoice, fulfillmentView, ordersTrash } =
    useSelector(selectOrderSlice);
  const memoriezedOrders = useMemo(() => orders, [orders]);

  // const [emailHtml, setEmailHtml] = useState(undefined);

  // useEffect(() => {
  //   if (invoice) {
  //     setEmailHtml(render(FulfillmentInvoiceEmail({ invoice })));
  //   }
  // }, [invoice]);
  return (
    <div
      className={`flex w-full mt-2 ${
        fulfillmentView === "orders" && !ordersCount && ordersCount <= 0
          ? "justify-start"
          : "justify-end"
      } `}
    >
      {fulfillmentView === "orders" &&
        (ordersCount && ordersCount > 0 ? (
          <OrderCategories
            ordersTrash={ordersTrash}
            orders={memoriezedOrders}
            categoryKey="category"
          />
        ) : (
          <p className="text-muted-foreground text-sm">No orders imported.</p>
        ))}
      {fulfillmentView === "invoice" && invoice && (
        <div className="flex items-center  gap-1">
          {/* <SendMailDialog
            emailHtml={emailHtml}
            type="fulfillment"
            data={invoice}
          >
            <Button variant="ghost" className="font-medium gap-2">
              <SendHorizontal size={14} />
              Send Invoice by email
            </Button>
          </SendMailDialog> */}
          <PrintInoviceLink href={`/print/${invoice._id}/fulfillment`} />
          <Dot className="text-primary" />
          <ToggleView />
        </div>
      )}
    </div>
  );
}
