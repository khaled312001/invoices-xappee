
"use client"
import { DotsHorizontalIcon, ViewNoneIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { DeleteCustomInvoiceButton } from "./fulfillment/invoice/deleteCustomInvoiceButton";
import { Edit2, View, ViewIcon } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";



export default function CustomInvoiceActions({ invoice,user }: { invoice: any,user: any }) {
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const router = useRouter(); // Access Next.js router
 
  
  // Toggle dropdown open/close
  const toggleOpen = () => setOpen(!open);

  // Navigate to the invoice edit page
  const handleEditInvoice = () => {
    router.push(`/invoices/edit/${invoice._id}`);
  };

  // Handle invoice deletion


  return (
    <DropdownMenu modal={false} open={open}>
      <DropdownMenuTrigger asChild>
        <Button onClick={toggleOpen} variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onInteractOutside={toggleOpen} align="end">
        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}

        <DropdownMenuItem>
          <Link
            href={`/invoices/${invoice._id}`}
            target="_blank"
            className="hover:bg-secondary flex items-center justify-between space-x-2 w-full"
          >
            <span>Show</span> <ViewIcon size={17} />
          </Link>
        </DropdownMenuItem>

        {user && user.role === "admin" ? <DropdownMenuItem>
          <Link
            href={`/invoices/edit/${invoice._id}`}
            target="_blank"
            className="hover:bg-secondary flex items-center justify-between w-full"
          >
            <span>Edit</span>
            <Edit2 size={17} />
          </Link>
        </DropdownMenuItem> : null}

        {user && user.role === "admin" ? <DeleteCustomInvoiceButton _id={invoice._id} setOpen={setOpenDeleteDialog} /> : null}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
