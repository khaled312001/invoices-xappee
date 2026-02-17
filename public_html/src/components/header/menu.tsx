"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileUp, LogOutIcon, Package, ShoppingCart } from "lucide-react";
import { signOut } from "next-auth/react";
import UserAvatar from "../shared/userAvatar";
import Link from "next/link";
import Image from "next/image";

export function HeaderAvatarMenu({ user }: { user: any }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button>
          <UserAvatar className="w-6 h-6" user={user} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-4 focus:bg-zinc-500/10 items-start">
            <UserAvatar className="w-11 h-11 " user={user} />
            <div className="">
              <p className="capitalize font-medium text-base">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuLabel className="flex items-center justify-between w-full">
            CSV File Uploads <FileUp size={17} />
          </DropdownMenuLabel>
          <Link href="/fulfillment/upload">
            <DropdownMenuItem className="flex w-full justify-between">
              Orders <ShoppingCart size={17} />
            </DropdownMenuItem>
          </Link>
          <Link href="/items/upload">
            <DropdownMenuItem className="flex w-full justify-between">
              Items <Package size={17} />
            </DropdownMenuItem>
          </Link> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem className="focus:bg-red-500 focus:text-white  ">
            <button
              className="flex w-full justify-between font-semibold p-1  "
              onClick={() => signOut()}
            >
              Sign Out <LogOutIcon strokeWidth={2.2} size={17} />
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
