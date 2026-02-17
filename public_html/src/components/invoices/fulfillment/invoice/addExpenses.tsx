"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, PoundSterling } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddExpenses({
  expenseValue,
  setExpenseValue,
  expenseCause,
  setExpenseCause,
}: {
  expenseValue: number;
  setExpenseValue: (value: number) => void;
  expenseCause: string;
  setExpenseCause: (cause: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExpenseChange = (key: string, value: any) => {
    if (key === "value") {
      setExpenseValue(parseFloat(value));
    } else if (key === "cause") {
      setExpenseCause(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate saving the data, add actual API call here
    try {
      // Example call to save expenses (replace with actual service call)
      // console.log({
      //   expenseValue,
      //   expenseCause,
      // });

      toast.success("Expense added successfully! Please regenerate the invoice again.");

      setOpen(false); // Close the dialog after submitting
    } catch (error) {
      toast.error("Error adding expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button className="gap-2 h-full" variant="secondary">
          <PoundSterling size={13} strokeWidth={3} />
          <p>Add Expenses</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-[380px] flex flex-col justify-center items-center"
      >
        <DialogHeader>
          <DialogTitle>Add Expenses</DialogTitle>
          <DialogDescription>
            Add additional expenses for the invoice.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-4 mt-5">
          <Input
            value={expenseCause}
            onChange={(e) =>
              handleExpenseChange("cause", e.target.value)
            }
            placeholder="Expense cause"
            className="rounded-md"
            name="cause"
          />
          <Input
            value={expenseValue}
            onChange={(e) =>
              handleExpenseChange("value", e.target.value)
            }
            placeholder="Amount"
            type="number"
            className="rounded-md"
            name="amount"
          />
        </div>
        <DialogFooter className="w-full">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="w-full rounded-md"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={20} />} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
