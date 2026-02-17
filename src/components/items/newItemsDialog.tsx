"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, PackagePlus, UploadCloud } from "lucide-react";
import { ChangeEvent, useState } from "react";
import NewItem from "./newItem";
import { useDispatch } from "@/redux/store";
import { newItemsThunk } from "@/redux/slices/itemSlice/thunks/newItemsThunk";
import { toast } from "sonner";
import { skip } from "node:test";

const getNewInitialItemValue = () => ({
  name: "",
  sku: "",
  price: undefined,
  skipFees: false,
  clients: [],
  items: undefined,
  parcels: undefined,
  length: undefined,
  width: undefined,
  height: undefined,
  weight: undefined,
  class: "",
  maxParcels: undefined,
});

export function NewItemsDialog({clients}:{clients:any[]}) {
  const [newItems, setNewItems] = useState([getNewInitialItemValue()]);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const dispatch = useDispatch();
  const handleValueChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const list: any = [...newItems];
    list[index][name] = value;
    setNewItems(list);
  };

  const handleSkipFeesValueChange = (
    index: number,
    e: boolean
  ) => {
    const list: any = [...newItems];
    list[index]["skipFees"] = e;
    setNewItems(list);
  };

  const handleAddNewRow = () => {
    setNewItems((prev: any) => [...prev, getNewInitialItemValue()]);
  };

  const handleRemoveRow = (index: number) => {
    if (index === 0 && newItems.length === 1) return;
    setNewItems((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleSubmitNewItems = async (e: any) => {
    e.preventDefault();
    if (newItems[0].sku.length === 0 || newItems[0].name.length === 0) {
      toast.error("No items to add.");
      return;
    }
    console.log("newItems", newItems);
     await dispatch(newItemsThunk(newItems));
     toggleOpen();
  };
  return (
    <Dialog onOpenChange={(v) => setOpen(v)} open={open}>
      <DialogTrigger onClick={toggleOpen} asChild>
        <Button className="gap-2 font-semibold">
          New Item <PackagePlus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={toggleOpen} className="sm:max-w-[75vw]">
        <DialogHeader>
          <DialogTitle className="flex gap-1 ">
            <PackagePlus size={17} /> New Item
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmitNewItems}
          className="flex flex-col justify-center"
        >
          <div className="h-[50vh] p-4">
            {newItems.map((item, index) => (
              <NewItem
                key={index}
                item={item}
                index={index}
                lastItem={index === newItems.length - 1}
                handleValueChange={handleValueChange}
                handleSkipFeesValueChange={handleSkipFeesValueChange}
                handleRemoveRow={handleRemoveRow}
                handleAddNewRow={handleAddNewRow}
                clients={clients}
              />
            ))}
          </div>
          <DialogFooter className="flex items-center">
            {/* <Button
              variant={"outline"}
              type="button"
              onClick={() => handleAddNewRow()}
              size={"icon"}
              className="group relative "
            >
              <ChevronDown size={20} />
            </Button> */}
            <Button type="submit" className="gap-2">
              Save <UploadCloud size={20} />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
