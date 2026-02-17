"use clinet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { revalidateClients } from "@/lib/actions/revalidateTag";
import { deleteClient } from "@/lib/services/client.service";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UpdateClientButton } from "./updateClient";
import { useState } from "react";

export function ClientCardMenu({ client }: { client: any }) {
  const handleDelteClient = async () => {
    const promise = deleteClient(client.name);

    toast.promise(promise, {
      loading: "Deleting...",
      success: (data) => {
        revalidateClients();

        return `${client.name} has been deleted`;
      },
      error: "Error",
    });
  };

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <DropdownMenu modal={false} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={toggleOpen}
          variant="ghost"
          className="hover:bg-foreground hover:text-background"
          size="icon"
        >
          <MoreHorizontal size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onInteractOutside={toggleOpen} className="w-56">

        <UpdateClientButton client={client} />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelteClient}>
          Delete {client.name}
          <DropdownMenuShortcut>
            <Trash2 size={15} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>




      </DropdownMenuContent>
    </DropdownMenu>
  );
}
