import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { softDeleteOrderThunk } from "@/redux/slices/orderSlice/thunks/softDeleteOrderThunk";
import { useDispatch } from "@/redux/store";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import { ChangeShippingInfo } from "./changeShippingInfo";
import AmazonPrep from "./amazonPrep";

export function OrderContextMenu({ order }: { order: any }) {
  const dispatch = useDispatch();
  return (
    <ContextMenuContent className="  w-44">
      <ContextMenuItem>
        Back
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem disabled>
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem className=" justify-between">
        <span>Reload {`(${order.selroOrderId})`}</span>
        <ReloadIcon fontSize={20} />
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>Shipping Method</ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
          <ChangeShippingInfo
            orderId={order.id}
            selectedServcie={order.shippingMethod}
            selectedCarrier={order.carrierName}
          />
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <AmazonPrep order={order} />

      <button
        className="w-full"
        onClick={() => dispatch(softDeleteOrderThunk(order._id))}
      >
        <ContextMenuItem className=" justify-between focus:bg-red-500/40 ">
          Move to trash <Trash2 size={15} />
        </ContextMenuItem>
      </button>
    </ContextMenuContent>
  );
}
