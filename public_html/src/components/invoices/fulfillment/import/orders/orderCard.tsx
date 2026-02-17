import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { ChannelLogo, ServiceTitle } from "./customFields";
import { Asterisk, Dot } from "lucide-react";
import OrderItemList from "./orderItemList";
import { OrderContextMenu } from "./orderContextMenu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import Warning from "@/components/ui/custom/warning";
import AmazonPrep from "./amazonPrep";

export default function OrderCard({
  order,
  index,
  clients
}: {
  order: any;

  index: number;
  clients: any[];
}) {
  const memoriezedOrder = useMemo(() => order, [order]);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);


  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <ContextMenu
        modal={false}
        onOpenChange={() => setIsContextMenuOpen(!isContextMenuOpen)}
      >
        <ContextMenuTrigger className="text-sm  grid grid-cols-4 gap-10 border border-t-0 p-4 relative overflow-x-hidden ">
          <section className="space-y-2 col-span-1">
            <div className="opacity-80 text-sm flex items-center">
              <p>{format(new Date(order.purchaseDate), "yyyy-MM-dd")}</p>
              <Dot size={20} className="text-primary" />
              <p>{format(new Date(order.purchaseDate), "hh:mm:ss")}</p>
            </div>
            <div>
              <p className="font-bold">{`(${order.selroChannelName})`}</p>
              <ChannelLogo channel={order.channel} />
            </div>
            <div>
              <p className="flex items-center">
                <Asterisk
                  size={18}
                  className={`text-primary ease-in-out duration-150  ${!isContextMenuOpen && "-ml-8 mr-[.78rem]"
                    }`}
                />
                <CardTitle>order id </CardTitle>
                <span className={`${isContextMenuOpen && "text-primary"}`}>
                  {" "}
                  {order.channelSales[0].orderId}
                </span>

                {/* <AmazonPrep order={order} /> */}

              </p>
              <p>
                <CardTitle>selro id</CardTitle>
                {order.selroOrderId}
              </p>
            </div>
          </section>
          <section>
            <p className="font-bold flex items-center gap-2">
              {order.carrierName || "null"} {!order.carrierName && <Warning />}
            </p>
            <ServiceTitle service={order.shippingMethod} />
            <br />
            <p className="flex items-center gap-2">
              <CardTitle>total-weight</CardTitle> {order.totalWeight}{" "}
              {order.totalWeight <= 0 && <Warning />}
            </p>
            <p className="flex items-center gap-2">
              <CardTitle>class</CardTitle>{" "}
              {order.channelSales.map((item: any) => item.class).join(",") || <span className="text-muted-foreground">none</span>}
              {order.channelSales
                .map((item: any) => item.class ? true : false)
                .includes(false) && <Warning />}
            </p>
            <p className="flex items-center gap-2">
              <CardTitle>postal-code</CardTitle>
              {order.shipPostalCode || "null"}
            </p>
          </section>
          <OrderItemList clients={clients} id={order.id} channelSales={order.channelSales} />
          <OrderContextMenu order={memoriezedOrder} />
        </ContextMenuTrigger>
      </ContextMenu>
    </>
  );
}

export const CardTitle = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className="text-muted-foreground font-medium">{children}: </span>
  );
};
