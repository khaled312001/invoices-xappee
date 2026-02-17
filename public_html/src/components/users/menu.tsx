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
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { UpdateUsertButton } from "./updateUser";
import { deleteUser } from "@/lib/services/auth.service";
import { revalidateUsers } from "@/lib/actions/revalidateTag";

export function UserCardMenu({ user }: { user: any }) {
  const handleDelteUser = async () => {
    console.log("user", user);
    const promise = deleteUser(user._id);

    toast.promise(promise, {
      loading: "Deleting...",
      success: (data) => {
        revalidateUsers();

        return `${user.email} has been deleted`;
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

        <UpdateUsertButton user={user} />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelteUser}>
          Delete {user.name}
          <DropdownMenuShortcut>
            <Trash2 size={15} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
