"use client";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { Info, PackagePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NewItemFromSku } from "../../fulfillment/import/orders/newItemFromsku";

export default function InvoiceItemsTable({
  items,
  monthlySubtotal,
  weeklySubTotal,
  totalStorageSpace,
  clients,
  storageStartMonth
}: {
  items: any[];
  monthlySubtotal: any;
  weeklySubTotal: any;
  totalStorageSpace: any;
  clients: any[];
  storageStartMonth? : Number
}) {
  const { getParam } = useSearchParams();
  const query = getParam("q");

  const problems: any = {
    count: 0,
    skus: [],
  };
  const [problemIndex, setProblemIndex] = useState(0);

  const itemsList = Object.entries(items).map(([key, value]) => {
    if (value.problem) {
      problems.count++, problems.skus.push(value.sku);
    }
    return {
      ...value,
      id: key,
    };
  });

  const handlePutProblemIntoView = () => {
    const nextIndex = (problemIndex + 1) % problems.skus.length;
    setProblemIndex(nextIndex);
  };

  useEffect(() => {
    const skuToScroll = problems.skus[problemIndex];
    const skuElement = document.getElementById(skuToScroll);
    if (skuElement) {
      skuElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [problemIndex]);

  return (
    <table className="table-auto border-collaps w-full ">
      <thead className="sticky top-0  text-left bg-background text-muted-foreground z-20">
        <tr className=" table-row grid-cols-7 px-4 pt-4">
          <th className="border p-2 relative min-w-[150px] ">
            SKU
            <button
              onClick={handlePutProblemIntoView}
              className=" font-normal inline-flex text-primary right-4 top-1/3 absolute items-start gap-1"
            >
              {problems.count ?? ""} <PackagePlus size={18} />
            </button>
          </th>
          <th className=" border p-2">Name</th>
          <th className="border p-2 w-[100px]">Item CBM</th>
          <th className=" border p-2">qty</th>
          <th className="border p-2 w-[100px]">Total CBM</th>
          <th className="border p-2">
            ECM
            <div className="group inline-flex mt-2 ml-2">
              <Info size={15} />
              <div className=" bg-white/10 backdrop-blur-md rounded-lg p-4 text-sm w-[250px] hidden group-hover:block absolute  font-normal">
                <b>Effective Cubic Meter.</b> <br />
                Total space taken by one item that can be allocated to another
                item.
              </div>
            </div>
            £{parseFloat(totalStorageSpace).toFixed(2)}
          </th>
          <th className="border p-2 text-muted-foreground">
            Per week £{parseFloat(weeklySubTotal).toFixed(2)}
          </th>
          <th className="border p-2 text-muted-foreground">
            Monthly £{parseFloat(monthlySubtotal).toFixed(2)}
          </th>
          
          {  !storageStartMonth ? <th className="border p-2 text-muted-foreground">
          upfront deposit £{parseFloat(monthlySubtotal).toFixed(2)}
          </th> : null}
          
        </tr>
      </thead>
      <tbody>
        {itemsList
          .filter((item: any) => {
            if (query) {
              return item.sku.includes(query);
            }
            return true;
          })
          .map((item: any) => {
            const { item_CBM, total_CBM, ECM, weeklyFee, montlyFee, sku } =
              item;
            return (
              <tr
                id={item.sku}
                className={`text-sm table-row grid-cols-7 ${
                  problems.skus[problemIndex] === item.sku && " bg-slate-500/10"
                }`}
                key={item.sku}
              >
                <td className="border p-2 font-semibold text-muted-foreground relative min-w-[150px]">
                  {item.sku}
                  <div className="inline-flex absolute top-1 right-4">
                    {<NewItemFromSku problem={item.problem ? true :false} item={item} clients={clients} />}
                  </div>
                </td>
                <td className="border p-2 font-semibold text-muted-foreground">
                  {item.name}
                </td>
                <td className="border p-2 mr-4 ">
                  {parseFloat(item_CBM).toFixed(4)}
                </td>
                <td className="border p-2 font-semibold text-muted-foreground">
                  {item.qty}
                </td>
                <td className="border p-2">
                  {parseFloat(total_CBM).toFixed(4)}
                </td>
                <td className="border p-2">{parseFloat(ECM).toFixed(4)}</td>
                <td className="border p-2">
                  £{parseFloat(weeklyFee).toFixed(2)}
                </td>
                <td className="border p-2">
                  £{parseFloat(montlyFee).toFixed(2)}
                </td>
              {  !storageStartMonth ? <td className="border p-2">
                  £{parseFloat(montlyFee).toFixed(2)}
                </td> : null}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
