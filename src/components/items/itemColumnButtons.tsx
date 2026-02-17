"use client";
import { Edit2, Trash2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeEvent, useState } from "react";
import { Row } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useDispatch } from "@/redux/store";
import { delteItemThunk } from "@/redux/slices/itemSlice/thunks/deleteItemThunk";
import { updateItemThunk } from "@/redux/slices/itemSlice/thunks/updateItemThunk";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";



export const DeleteItemButton = ({
  _id,
  setOpen,
}: {
  _id: string;
  setOpen: any;
}) => {
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = useState(false);

  const handleDeleteItem = async () => {
    await dispatch(delteItemThunk(_id));
    setOpen(false);
  };



  return (
    <div>

      <button className="w-full" onClick={() => setAlertOpen(true)}>
        <DropdownMenuItem className="justify-between  focus:bg-red-500/20">
          Delete <Trash2 size={17} />
        </DropdownMenuItem>
      </button>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        {/* <AlertDialogTrigger>Confirm Deletion</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>

  );
};

export const UpdateItemButton = ({ item }: { item: Row<any> }) => {
  console.log("item", item)
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState<any>({
    name: item.getValue("name"),
    sku: item.getValue("sku"),
    weight: item.getValue("weight"),
    maxParcels: item.getValue("maxParcels"),
    parcels: item.getValue("parcels"),
    client: item.getValue("client"),
    width: item.getValue("width"),
    height: item.getValue("height"),
    length: item.getValue("length"),
    price: item.getValue("price"),
    boxHeight: item.getValue("boxHeight"),
    boxLength: item.getValue("boxLength"),
    boxWidth: item.getValue("boxWidth"),
    class: item.getValue("class"),
    qty: item.getValue("qty"),
    lastUpdatedDate: item.getValue("lastUpdatedDate"),
    items: item.getValue("items"),
    skipFees: item.getValue("skipFees"),
  });
  console.log("newItem", item.getValue("skipFees"))
  const oldQty = item.getValue("qty");

  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };


  const handleSkipFeesCheckedChagne = (v: any) => {
    setNewItem({
      ...newItem,
      skipFees: v,
    });
  };


  const handleSubmitItem = async (e: any) => {
    e.preventDefault();
    try {
      await dispatch(updateItemThunk(newItem));
      setOpen(false);
    } catch (err: any) {
      toast.error(`Item isn't updated, please try again. | ${err.message}`);
    }
  };
  const handleCheckedChagne = (v: any) => {
    if (v) {
      setNewItem({
        ...newItem,
        lastUpdatedDate: Date.now(),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(!open)} className="w-full">
          <DropdownMenuItem className="justify-between">
            Edit <Edit2 size={17} />
          </DropdownMenuItem>
        </button>
      </DialogTrigger>
      <DialogContent
        // onClick={() => setOpen(!open)}
        onInteractOutside={() => setOpen(!open)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            {item.getValue("sku")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitItem} className="grid gap-4 py-4">
          <Input
            onChange={(e) => handleInputChange(e)}
            label="name"
            name="name"
            placeholder="title"
            value={newItem.name}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              onChange={(e) => handleInputChange(e)}
              label="weight"
              name="weight"
              placeholder="weight"
              value={newItem.weight}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="quantity"
              name="qty"
              placeholder="quantity"
              value={newItem.qty}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="items"
              name="items"
              placeholder="items"
              value={newItem.items}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              onChange={(e) => handleInputChange(e)}
              label="width"
              name="width"
              placeholder="width"
              value={newItem.width}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="Height"
              name="height"
              placeholder="Height"
              value={newItem.height}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="Length"
              name="length"
              placeholder="Length"
              value={newItem.length}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Input
              onChange={(e) => handleInputChange(e)}
              label="class"
              name="class"
              placeholder="class"
              value={newItem.class}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="maxParcels"
              name="maxParcels"
              placeholder="maxParcels"
              value={newItem.maxParcels}
            />
            <Input
              label="parcels"
              name="parcels" // This was missing the onChange handler
              placeholder="parcels"
              value={newItem.parcels || ""}
              onChange={(e) => handleInputChange(e)} // Add this line
            />
            <Input
              label="qty"
              name="qty" // This was missing the onChange handler
              placeholder="qty"
              value={newItem.qty || ""}
              onChange={(e) => handleInputChange(e)} // Add this line
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Input
              onChange={(e) => handleInputChange(e)}
              label="price"
              name="price"
              placeholder="price"
              value={newItem.price}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="boxHeight"
              name="boxHeight"
              placeholder="boxHeight"
              value={newItem.boxHeight}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="boxWidth"
              name="boxWidth"
              placeholder="boxWidth"
              value={newItem.boxWidth}
            />
            <Input
              onChange={(e) => handleInputChange(e)}
              label="boxLength"
              name="boxLength"
              placeholder="boxLength"
              value={newItem.boxLength}
            />

          </div>
          <div className="flex relative items-center gap-2">
            <Switch defaultChecked={newItem.skipFees} checked={newItem.skipFees} onCheckedChange={handleSkipFeesCheckedChagne} />
            <Label className="  text-xs font-light bg-background rounded-lg">
              Don&apos;t use item in storage fees
            </Label>
          </div>

          {oldQty !== newItem.qty && (
            <div className="flex items-center gap-2 ml-1">
              <Checkbox onCheckedChange={(v) => handleCheckedChagne(v)} />
              <p>Current warehouse stock?</p>
            </div>
          )}
          <Button>Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
