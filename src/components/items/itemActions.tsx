import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteItemButton, UpdateItemButton } from "./itemColumnButtons";
// import { DeleteItemButton, UpdateItemButton } from "./itemColumnButtons";

export default function ItemActions({ row }: { row: any }) {
  const item = row.original;

  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);
  return (
    <DropdownMenu modal={false} open={open}>
      <DropdownMenuTrigger asChild>
        <Button onClick={toggleOpen} variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onInteractOutside={toggleOpen} align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(item.sku)}
        >
          Copy SKU
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <UpdateItemButton item={row} />
        {/* <DeleteItemButton setOpen={setOpen} _id={row.getValue("_id")} /> */}
        <DeleteItemButton setOpen={setOpen} _id={item._id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
