import { Button } from "@/components/ui/button";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { useDispatch, useSelector } from "@/redux/store";
import { ArrowRightLeft } from "lucide-react";

export const ToggleInvoiceOrdersView = () => {
  const dispatch = useDispatch();
  const { fulfillmentView, invoice } = useSelector(selectOrderSlice);

  return (
    <Button
      className="flex-shrink-0 flex-1 p-2 rounded-xl"
      disabled={!invoice}
      onClick={() => {
        const newView =
          fulfillmentView === "orders" ||
          (fulfillmentView === undefined && invoice)
            ? "invoice"
            : "orders";
        dispatch(orderSlice.actions.toggleFulfillmentView(newView));
      }}
      variant="outline"
      size="icon"
    >
      <ArrowRightLeft />
    </Button>
  );
};
