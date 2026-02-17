import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "@/lib/hooks/useSearchParams";

export function PrintFilterButton() {
  const { setParam } = useSearchParams();

  return (
    <Select onValueChange={(v) => setParam("printed", v)}>
      <SelectTrigger className="p-0 border-none ">
        <SelectValue placeholder="Print Status" className="w-[170px]" />
      </SelectTrigger>
      <SelectContent align="start" className="w-[180px]">
        <SelectGroup>
          <SelectItem value={"true"}>
            <span>Printed</span>
          </SelectItem>
          <SelectItem value={"false"}>
            <span>Not printed</span>
          </SelectItem>
          <SelectItem value={"All"}>All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
