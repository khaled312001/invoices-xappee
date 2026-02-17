"use client";
import React, { useEffect } from "react";
import FilteredOrdersList from "./import/orders/filteredOrders";
import { useDispatch, useSelector } from "@/redux/store";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import FulfillmentInvoiceontainer from "./invoice/container";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProblemsTable from "./invoice/problemsTable";
import { fetchCarriersThunk } from "@/redux/slices/orderSlice/thunks/fetchCarriersThunk";

export default function FulfullmentContainer({
  carriers,
  clients
}: {
  carriers: any[];
  clients: any[]; 
}) {
  const { invoice, fulfillmentView, carrierStatus } =
    useSelector(selectOrderSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (carrierStatus === "idle") {
      dispatch(fetchCarriersThunk());
    }
  }, [carrierStatus]);
  return (
    <div>
      {fulfillmentView === "orders" ? (
        <FilteredOrdersList clients={clients} carriers={carriers} />
      ) : fulfillmentView === "invoice" && invoice ? (
        <Invoice clients={clients}  carriers={carriers} />
      ) : fulfillmentView === undefined && invoice ? (
        <Invoice clients={clients} carriers={carriers} />
      ) : (
        <FilteredOrdersList clients={clients} carriers={carriers} />
      )}
    </div>
  );
}

// if user clicked on generate and invoice is generated show it instead.

const Invoice = ({ carriers, clients }: { carriers: any[],clients:any[] }) => {
  const { invoice } = useSelector(selectOrderSlice);
  const { InvoiceByOrder, InvoiceByService, problems } = invoice;

  const OrdersAndServices = {
    orders: Object.values(InvoiceByOrder),
    services: Object.values(InvoiceByService),
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border "
    >
      <ResizablePanel defaultSize={15}>
        <div className="min-w-[1150px] w-full overflow-hidden h-[75vh] overflow-y-auto">
          <ProblemsTable clients={clients} carriers={carriers} problems={problems} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <div className="min-w-[1200px] w-full overflow-hidden h-[75vh] overflow-y-auto ">
          <FulfillmentInvoiceontainer invoice={OrdersAndServices} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
