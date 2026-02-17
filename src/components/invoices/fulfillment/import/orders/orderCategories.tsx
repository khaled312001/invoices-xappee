import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import OrdersSearch from "./ordersSearch";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { calculateOrdersProblems } from "@/lib/helpers/order.helpers";
import { Button } from "@/components/ui/button";
import { Redo, Trash2 } from "lucide-react";
import { useDispatch } from "@/redux/store";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";

interface OrderTypeCardProps {
  children: React.ReactNode;
  className?: string;
}

const OrderTypeCard: React.FC<OrderTypeCardProps> = ({
  children,
  className,
}) => (
  <p
    className={cn(
      "px-2 p-1 rounded-xl text-muted-foreground border-2 border-dashed min-w-10 hover:bg-muted font-semibold text-sm cursor-default",
      className
    )}
  >
    {children}
  </p>
);

interface OrderCategoriesProps {
  categoryKey: string;
  orders: any[]; // Consider specifying a more detailed type
  ordersTrash: any[];
}

const OrderCategories: React.FC<OrderCategoriesProps> = ({
  categoryKey,
  orders,
  ordersTrash,
}) => {
  const { setParam } = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const dispatch = useDispatch();
  const orderTypes = React.useMemo(
    () => calculateOrdersProblems(orders),
    [orders]
  );
console.log("orderTypes", orderTypes);
  useEffect(() => {
    // This side-effect can be removed if it's only setting orderTypes
    // since useMemo is now handling the calculation of orderTypes directly.
  }, [orders]);

  const handleToggleCategory = (key: string) => {
    setParam(categoryKey, key);
    setActiveCategory(key);
  };
console.log("orders", orders.length);
  const handleGetFilteredOrders = () => {
    return orders.filter(
      (order) =>
        order.totalWeight !== 0 &&
        order.totalWeight !== null &&
        order.channelSales.every(
          (channelSale: any) =>
            channelSale.weight !== undefined &&
            channelSale.weight !== null &&
            channelSale.weight !== 0 &&
            channelSale.class !== undefined &&
            channelSale.class !== null &&
            channelSale.class !== ""
        )
    );
  };

  const handleDeleteIncompleteOrders = () => {
    const filtered = handleGetFilteredOrders();
    dispatch(
      orderSlice.actions.filterOrders(filtered.map((order) => order.id))
    );
  };
  const handleRestoreOrdersFromTrash = () => {
    dispatch(orderSlice.actions.restoreOrders());
  };

  return (
    <div className="relative flex items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {  ordersTrash.length === 0 ? (
          <Button
            onClick={handleDeleteIncompleteOrders}
            size="sm"
            variant="destructive"
            className="font-medium text-sm  gap-2"
          >
            Move incomplete orders to trash <Trash2 size={14} />
          </Button>
        ) : (
          <Button
            onClick={handleRestoreOrdersFromTrash}
            size="sm"
            variant="success"
            className="font-medium text-sm  gap-2"
          >
            Restore orders from trash <Redo size={14} />
          </Button>
        )}

        <button onClick={() => handleToggleCategory("all")}>
          <OrderTypeCard
            className={cn({
              "bg-primary text-white": activeCategory === "all",
            })}
          >
            All {orders.length}
          </OrderTypeCard>
        </button>
        {Object.entries(orderTypes).map(([key, { count }]) =>
          count > 0 ? (
            <button key={key} onClick={() => handleToggleCategory(key)}>
              <OrderTypeCard
                className={cn({
                  "bg-primary text-white": activeCategory === key,
                })}
              >
                {`${key.replace("_", " ")} ${count}`}
              </OrderTypeCard>
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default OrderCategories;
