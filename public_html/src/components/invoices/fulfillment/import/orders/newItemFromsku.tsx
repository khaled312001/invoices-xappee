import { DataSelector } from "@/components/shared/dataSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CloseBtn from "@/components/ui/custom/closeBtn";
import Spinner from "@/components/ui/custom/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { postNewItem } from "@/lib/services/item.service";
import { fixOneOrderThunk } from "@/redux/slices/orderSlice/thunks/fixOneOrderThunk";
import { useDispatch } from "@/redux/store";
import { PopoverClose } from "@radix-ui/react-popover";
import { PackagePlus, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CustomMultipleSelect from "@/components/items/CustomMultipleSelect";
import { updateOrder } from "@/lib/services/orders.service";
export function NewItemFromSku({
  problem,
  item,
  id,
  handleProblemSolved,
  clients
}: {
  problem: boolean;
  item: any;
  id?: string;
  handleProblemSolved?: (id: string) => void;
  clients: any[]
}) {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState(item);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState<string[]>(item.client ?? []);
  const dispatch = useDispatch();
  const handleNewItem = (e: any) => {
    setNewItem((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitNewItem = async () => {
    try {
      setLoading(true);
      const isAdded = await postNewItem({ ...newItem, client: clientName });
      if (isAdded) {
        toast.success("Item added successfully");
        if (id) {
          if (newItem.orderQuantity) {
            const isUpdated = await updateOrder(id, {
              itemSku: newItem.sku,
              itemOrderQty: newItem.orderQuantity,
              channelSaleId: item.id
            });
          }
          // if there is no id then it's coming from storage invoice and there is no need ot fix any orders.
          await dispatch(fixOneOrderThunk(id));
          if (handleProblemSolved) {
            handleProblemSolved(id);
            toast.info(
              "Don't forget to generate invoice again after finshing."
            );
          }
        }
      } else {
        toast.error("something went wrong, try again.");
      }
    } catch (e: any) {
      toast.error(`something went wrong, try again. | ${e.message}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleCheckedChagne = (v: any) => {
    setNewItem({
      ...newItem,
      skipFees: v,
    });
  };
console.log("itemmmmmmmmmmm",item)
  return (
    <Popover onOpenChange={(v) => setOpen(v)} open={open}>
      <PopoverTrigger onClick={() => setOpen(true)} asChild>
        <button>
          <PackagePlus
            size={20}
            className={` ${problem === false ? "text-muted" : "text-primary"
              } hover:scale-110  ease-in-out duration-75 rounded-full p-[1px]`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={() => setOpen(false)}
        className="w-80 rounded-2xl"
      >
        <div className="grid gap-2 ">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium leading-none">New Item </h4>
              <PopoverClose>
                <CloseBtn />
              </PopoverClose>
            </div>
            <p className="text-sm text-muted-foreground">
              Add a new item quickly to database
            </p>
          </div>
          {/* <Select onValueChange={setClientName} value={clientName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Clients</SelectLabel>
                {
                  clients.map((c) => (
                    <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
          <CustomMultipleSelect
            clients={clients}
            selectedClients={clientName}
            onSelectionChange={setClientName}
          />

          <div className="flex items-start gap-4 mt-2">
            <div className="grid gap-4">

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="items"
                >
                  Name
                </Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => handleNewItem(e)}
                  id="name"
                  name="name"
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="sku"
                >
                  Sku
                </Label>
                <Input
                  value={newItem.sku}
                  onChange={(e) => handleNewItem(e)}
                  id="sku"
                  name="sku"
                  readOnly
                  disabled
                  defaultValue={item.sku}
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="items"
                >
                  Items
                </Label>
                <Input
                  value={newItem.items}
                  onChange={(e) => handleNewItem(e)}
                  id="items"
                  name="items"
                  defaultValue="1"
                  className="h-10 "
                />
              </div>
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="width"
                >
                  Width
                </Label>
                <Input
                  value={newItem.width}
                  onChange={(e) => handleNewItem(e)}
                  id="width"
                  name="width"
                  className="h-10 "
                />
              </div>
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="height"
                >
                  Height
                </Label>
                <Input
                  value={newItem.height}
                  onChange={(e) => handleNewItem(e)}
                  id="height"
                  name="height"
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="length"
                >
                  Length
                </Label>
                <Input
                  value={newItem.length}
                  onChange={(e) => handleNewItem(e)}
                  id="length"
                  name="length"
                  className="h-10 "
                />
              </div>


            </div>
            <div className="grid gap-4">
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="maxWidth"
                >
                  Weight
                </Label>
                <Input
                  value={newItem.weight}
                  onChange={(e) => handleNewItem(e)}
                  id="weight"
                  name="weight"
                  className="h-10 "
                />
              </div>
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="maxHeight"
                >
                  Parcels
                </Label>
                <Input
                  value={newItem.parcels}
                  onChange={(e) => handleNewItem(e)}
                  id="parcels"
                  name="parcels"
                  defaultValue="1"
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="maxParcels"
                >
                  Max parcels
                </Label>
                <Input
                  value={newItem.maxParcels}
                  onChange={(e) => handleNewItem(e)}
                  id="maxParcels"
                  name="maxParcels"
                  className="h-10 "
                />
              </div>
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="class"
                >
                  Class
                </Label>
                <Input
                  value={newItem.class}
                  onChange={(e) => handleNewItem(e)}
                  id="class"
                  name="class"
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="orderQuantity"
                >
                  Order qty
                </Label>
                <Input
                  value={newItem.orderQuantity}
                  onChange={(e) => handleNewItem(e)}
                  id="orderQuantity"
                  name="orderQuantity"
                  className="h-10 "
                />
              </div>




            </div>

            <div className="grid gap-4">
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="boxLength"
                >
                  Box Length
                </Label>
                <Input
                  value={newItem.boxLength}
                  onChange={(e) => handleNewItem(e)}
                  id="boxLength"
                  name="boxLength"
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="boxWidth"
                >
                  Box Width
                </Label>
                <Input
                  value={newItem.boxWidth}
                  onChange={(e) => handleNewItem(e)}
                  id="boxWidth"
                  name="boxWidth"
                  className="h-10 "
                />
              </div>
              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="boxHeight"
                >
                  Box Height
                </Label>
                <Input
                  value={newItem.boxHeight}
                  onChange={(e) => handleNewItem(e)}
                  id="boxHeight"
                  name="boxHeight"
                  className="h-10 "
                />
              </div>

              <div className="grid relative items-center gap-2">
                <Label
                  className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                  htmlFor="qty"
                >
                  Quantity
                </Label>
                <Input
                  value={newItem.qty}
                  onChange={(e) => handleNewItem(e)}
                  id="qty"
                  name="qty"
                  className="h-10 "
                />
              </div>


            </div>
          </div>
          <div className="flex">
            <div className="flex relative items-center gap-2">
              <Switch checked={newItem.skipFees} onCheckedChange={handleCheckedChagne} />
              <Label className="  text-xs font-light bg-background rounded-lg">
                Don&apos;t use item in storage fees
              </Label>
            </div>

            <Button
              disabled={loading}
              onClick={handleSubmitNewItem}
              className="gap-2 font-bold "
            >
              Upload {loading ? <Spinner /> : <UploadCloud size={20} />}
            </Button></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}


