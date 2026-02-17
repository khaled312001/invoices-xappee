import { useState, useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DataSelectorProps {
  data: any[];
  selectedData: any[] | any;
  selectData: React.Dispatch<React.SetStateAction<any>>;
  mutliple?: boolean;
  text: string;
  itemKey: string;
  returnKey?: string;
  name?: any;
  extra?: any;
  selectAll?: boolean;
}

export const DataSelector = ({
  data,
  selectedData,
  selectData,
  mutliple,
  text,
  itemKey,
  returnKey,
  name,
  extra,
  selectAll,
}: DataSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setAllSelected(
      Array.isArray(selectedData) && selectedData.length === data.length
    );
  }, [selectedData, data]);

  const toggleChannelSelection = (item: any): void => {

    if (!item) return; // Guard clause
    const selectedValue =
      returnKey && item[returnKey] !== undefined ? item[returnKey] : item;

    if (mutliple) {
      const isSelected =
        Array.isArray(selectedData) && selectedData.includes(selectedValue);
      if (isSelected) {
        selectData((currentSelected: any[]) =>
          Array.isArray(currentSelected)
            ? currentSelected.filter((value) => value !== selectedValue)
            : []
        );
      } else {
        selectData((currentSelected: any[]) =>
          Array.isArray(currentSelected)
            ? [...currentSelected, selectedValue]
            : [selectedValue]
        );
      }
    } else {
      selectData(selectedValue);
      setOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      selectData([]);
    } else {
      selectData(
        returnKey ? data.map((d) => d[returnKey]).filter(Boolean) : data
      );
    }
  };

  const getDisplayValue = () => {
    if (mutliple) {
      return Array.isArray(selectedData) && selectedData.length > 0
        ? `${selectedData.length} ${text} selected`
        : `Select ${text}`;
    } else {
      if (selectedData) {
        const selectedItem = data.find((item) =>
          selectedData.includes(item[name])
        );
        return selectedItem
          ? name
            ? selectedItem[name]
            : selectedItem[itemKey]
          : `Select   ${text}`;
      }
      return `Select ${text}`;
    }
  };

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-60 justify-between rounded-xl capitalize"
        >
          {getDisplayValue()}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-2xl p-1">
        <Command>
          <CommandEmpty>No {text} found.</CommandEmpty>

          <CommandGroup className="pretty-scrollbar overflow-y-auto max-h-[40vh]">
            {selectAll && Array.isArray(data) && data.length > 1 && (
              <CommandItem>
                <button
                  onClick={handleSelectAll}
                  className="w-full text-left h-full"
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              </CommandItem>
            )}
            {Array.isArray(data) &&
              data.map(
                (item) =>
                  item &&
                  itemKey && (
                    <CommandItem
                      key={item[itemKey]}
                      value={item[itemKey]}
                      onSelect={() => toggleChannelSelection(item)}
                      className="text-sm rounded-xl"
                    >
                      {name && item[name] ? item[name] : item[itemKey]}
                      {extra && item[extra] && (
                        <span className="text-muted-foreground">{`(${item[extra]})`}</span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          Array.isArray(selectedData) &&
                            selectedData.includes(
                              returnKey && item[returnKey] !== undefined
                                ? item[returnKey]
                                : item
                            )
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
              )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
