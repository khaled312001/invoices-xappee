import { Edit2, Edit3 } from "lucide-react";
import React, { useState } from "react";
import { NewItemFromSku } from "../import/orders/newItemFromsku";
import { ChangeShippingInfo } from "../import/orders/changeShippingInfo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProblemsTable({
  problems,
  carriers,
  clients
}: {
  problems: any[];
  carriers: any[];
  clients:any[]
}) {
  const [problemsArray, setProblemsArray] = useState(Object.values(problems));

  const handleProblemSolved = (id: string) => {
    setProblemsArray((prev) => prev.filter((i) => i.id !== id));
  };
  return (
    <table className="table-auto border-collapse w-full">
      <thead>
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Issue</th>
          <th className="border p-2">
            <Edit2 size={20} className="inline-flex mr-2" /> item
          </th>
          <th className="border p-2">
            <Edit2 size={20} className="inline-flex mr-2" /> shipping
          </th>
        </tr>
      </thead>
      {problemsArray.map((problem, i) => (
        <tbody key={i}>
          <td className="border p-2">{problem.id}</td>
          <td className="border p-2">{problem.issue}</td>
          <td className="border p-2">
            {problem.item && (
              <NewItemFromSku
              clients={clients}
                problem={problem ? true :false}
                handleProblemSolved={handleProblemSolved}
                id={problem.id}
                item={problem.item}
              />
            )}
          </td>
          <td className="border p-2">
            {problem.carrier && (
              <Popover>
                <PopoverTrigger>
                  <button className="flex gap-2 items-center">
                    <Edit3 size={20} /> Shipping
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  <ChangeShippingInfo
                    handleProblemSolved={handleProblemSolved}
                    orderId={problem.id}
                    selectedCarrier={problem.carrier}
                    selectedServcie={problem.service}
                  />
                </PopoverContent>
              </Popover>
            )}
          </td>
        </tbody>
      ))}
    </table>
  );
}
