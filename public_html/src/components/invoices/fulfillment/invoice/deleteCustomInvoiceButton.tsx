"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCustomInvoice } from "@/lib/services/invoice.service";


export const DeleteCustomInvoiceButton = ({
  _id,
  setOpen,
}: {
  _id: string;
  setOpen: any;
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
const router = useRouter();
  const handleDeleteInvoice = async () => {
    try {
      const ok = await deleteCustomInvoice(_id); // Use `updateInvoice` to save changes
      console.log("ok,",ok)
      if (ok) {
        console.log("ok");
        setOpen(false);
        router.push('/invoices'); // Navigate to the invoice list page after successful update
      }
      //   else {
      //     toast.error(data.error.message, { id: toastId });
      //   }
    } catch (err: any) {
      toast.error(`Invoice isn't deleted, please try again. | ${err.message}`);
    }
    
  };

  return (
    <div>

      <button className="w-full" onClick={() => setAlertOpen(true)}>
        <DropdownMenuItem className="justify-between ">
        Delete <Trash2 size={17} />
        </DropdownMenuItem>
      </button>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        {/* <AlertDialogTrigger>Confirm Deletion</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>

  );
};
