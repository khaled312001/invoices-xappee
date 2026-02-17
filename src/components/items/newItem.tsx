// import React, { ChangeEvent } from "react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { X } from "lucide-react";

// export default function NewItem({
//   item,
//   handleValueChange,
//   index,
//   handleAddNewRow,
//   handleRemoveRow,
//   lastItem,
// }: {
//   item: any;
//   handleValueChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
//   handleAddNewRow: () => void;
//   handleRemoveRow: (index: number) => void;
//   index: number;
//   lastItem: boolean;
// }) {
//   return (
//     <div className="grid grid-cols-3 gap-4 items-center relative px-5">
//       <Button
//         type="button"
//         className="hidden group-hover:inline-flex rounded-full hover:bg-red-500 absolute w-4 h-4 hover:text-white -left-1"
//         variant={"secondary"}
//         disabled={index === 0 && lastItem}
//         size={"icon"}
//         onClick={() => handleRemoveRow(index)}
//       >
//         <X size={13} />
//       </Button>
//       <div className="flex flex-col">
//         <Input
//           id={`sku-${index}`}
//           className="focus:z-10 w-[120px]"
//           placeholder="SKU*"
//           name="sku"
//           value={item.sku}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//         <Input
//           className="focus:z-10"
//           placeholder="Items*"
//           name="items"
//           value={item.items}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//         <Input
//           className="focus:z-10"
//           placeholder="Parcels*"
//           name="parcels"
//           value={item.parcels}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//       </div>
//       <div className="flex flex-col">
//         <Input
//           className="focus:z-10"
//           placeholder="Length*"
//           name="length"
//           value={item.length}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//         <Input
//           className="focus:z-10"
//           placeholder="Width*"
//           name="width"
//           value={item.width}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//         <Input
//           className="focus:z-10"
//           placeholder="Height*"
//           name="height"
//           value={item.height}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//       </div>
//       <div className="flex flex-col">
//         <Input
//           className="focus:z-10"
//           placeholder="Weight*"
//           name="weight"
//           value={item.weight}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//         <Input
//           className="focus:z-10"
//           placeholder="Class*"
//           name="class"
//           value={item.class}
//           onChange={(e) => handleValueChange(index, e)}
//         />
//         <Input
//           className="focus:z-10"
//           placeholder="Max Parcels*"
//           name="maxParcels"
//           value={item.maxParcels}
//           onChange={(e) => {
//             handleValueChange(index, e);
//             lastItem && handleAddNewRow();
//           }}
//         />
//       </div>
//     </div>
//   );
// }
import React, { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import CustomMultipleSelect from "./CustomMultipleSelect";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export default function NewItem({
  item,
  handleValueChange,
  handleSkipFeesValueChange,
  index,
  handleAddNewRow,
  handleRemoveRow,
  lastItem,
  clients
}: {
  item: any;
  handleValueChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
  handleSkipFeesValueChange: (index: number, e: boolean) => void;
  handleAddNewRow: () => void;
  handleRemoveRow: (index: number) => void;
  index: number;
  lastItem: boolean;
  clients: any[];
}) {
  const [clientName, setClientName] = useState<string[]>(item.client ?? []);



  return (
    <div className="grid grid-cols-4 gap-4 items-start relative px-5">
      <Button
        type="button"
        className="hidden group-hover:inline-flex rounded-full hover:bg-red-500 absolute w-4 h-4 hover:text-white -left-1"
        variant={"secondary"}
        disabled={index === 0 && lastItem}
        size={"icon"}
        onClick={() => handleRemoveRow(index)}
      >
        <X size={13} />
      </Button>
      <div className="flex flex-col gap-4">
        <Input
          id={`name-${index}`}
          className="focus:z-10"
          placeholder="Name"
          name="name"
          value={item.name}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          id={`sku-${index}`}
          className="focus:z-10"
          placeholder="Sku"
          name="sku"
          value={item.sku}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Price"
          name="price"
          type="number"
          value={item.price}
          onChange={(e) => handleValueChange(index, e)}
        />
        <div className="flex relative items-center gap-2">
          <Switch checked={item.skipFees} onCheckedChange={(e) => handleSkipFeesValueChange(index, e)} />
          <Label className="  text-xs font-light bg-background rounded-lg">
            Don&apos;t use item in storage fees
          </Label>
        </div>


      </div>
      <div className="flex flex-col gap-4">

        <CustomMultipleSelect
          clients={clients}
          selectedClients={clientName}
          onSelectionChange={setClientName}
        />
        <Input
          className="focus:z-10"
          placeholder="Length"
          name="length"
          type="number"
          value={item.length}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Width"
          name="width"
          type="number"
          value={item.width}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Height"
          name="height"
          type="number"
          value={item.height}
          onChange={(e) => handleValueChange(index, e)}
        />
      </div>
      <div className="flex flex-col gap-4">

        <Input
          className="focus:z-10"
          placeholder="Class"
          name="class"
          value={item.class}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Box Length"
          name="boxLength"
          type="number"
          value={item.boxLength}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Box Width"
          name="boxHeight"
          value={item.boxHeight}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Box Height"
          name="boxHeight"
          type="number"
          value={item.boxHeight}
          onChange={(e) => handleValueChange(index, e)}
        />
      </div>
      <div className="flex flex-col gap-4">

        <Input
          className="focus:z-10"
          placeholder="Items"
          name="items"
          type="number"
          value={item.items}
          onChange={(e) => handleValueChange(index, e)}
        />
        <Input
          className="focus:z-10"
          placeholder="Weight"
          name="weight"
          type="number"
          value={item.weight}
          onChange={(e) => handleValueChange(index, e)}
        />

        <Input
          className="focus:z-10"
          placeholder="Max Parcels"
          name="maxParcels"
          type="number"
          value={item.maxParcels}
          onChange={(e) => {
            handleValueChange(index, e);
            lastItem && handleAddNewRow();
          }}
        />

        <Input
          className="focus:z-10"
          placeholder="qty"
          name="qty"
          type="number"
          value={item.qty}
          onChange={(e) => handleValueChange(index, e)}
        />
      </div>
    </div>
  );
}
