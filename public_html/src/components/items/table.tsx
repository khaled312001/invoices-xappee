"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "../ui/custom/spinner";
import ItemActions from "./itemActions";
import { useDispatch } from "@/redux/store";
import { fetchItemSearchQueryThunk } from "@/redux/slices/itemSlice/thunks/fetchItemSearchQueryThunk";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";
import { getCurrentSession } from "@/lib/auth";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="w-[280px]">{String(row.getValue("name")).slice(0, 100)}</div>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="max-w-[120px]">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const clients = row.getValue("client") as string[]; // Ensure client is an array
      return (
        <div className="">
          {clients?.join(", ")} {/* Join the array elements with commas */}
        </div>
      );
    },
  },
  {
    accessorKey: "qty",
    header: "Quantity",
    cell: ({ row }) => <div className="">{row.getValue("qty")}</div>,
  },
  {
    accessorKey: "lastUpdatedDate",
    header: "Last updated date",
    cell: ({ row }) => (
      <div className="text-nowrap">{row.getValue("lastUpdatedDate")}</div>
    ),
  },
  {
    accessorKey: "parcels",
    header: "Parcels",
    cell: ({ row }) => <div className="">{row.getValue("parcels")}</div>,
  },
  {
    accessorKey: "maxParcels",
    header: "Max Parcels",
    cell: ({ row }) => <div className="">{row.getValue("maxParcels")}</div>,
  },
  {
    accessorKey: "length",
    header: "Length",
    cell: ({ row }) => <div className="">{row.getValue("length")}</div>,
  },
  {
    accessorKey: "width",
    header: "Width",
    cell: ({ row }) => <div className="">{row.getValue("width")}</div>,
  },
  {
    accessorKey: "height",
    header: "Height",
    cell: ({ row }) => <div className="">{row.getValue("height")}</div>,
  },
  {
    accessorKey: "boxLength",
    header: "boxLength",
    cell: ({ row }) => <div className="">{row.getValue("boxLength")}</div>,
  },
  {
    accessorKey: "boxWidth",
    header: "boxWidth",
    cell: ({ row }) => <div className="">{row.getValue("boxWidth")}</div>,
  },
  {
    accessorKey: "boxHeight",
    header: "boxHeight",
    cell: ({ row }) => <div className="">{row.getValue("boxHeight")}</div>,
  },
  {
    accessorKey: "weight",
    header: "Weight (g)",
    cell: ({ row }) => <div className="">{row.getValue("weight")}</div>,
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => <div className="">{row.getValue("class")}</div>,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <div className="">{row.getValue("items")}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div className="">{row.getValue("price")}</div>,
  },
  {
    accessorKey: "skipFees",
    header: "skipFees",
    cell: ({ row }) => <div className="">{row.getValue("skipFees")}</div>,
  },
  {
    accessorKey: "qty",
    header: "qty",
    cell: ({ row }) => <div className="">{row.getValue("qty")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ItemActions row={row} />,
  },
];

export function ItemsTable({
  data,
  loading,
  user
}: {
  data: any[];
  loading: boolean;
  user: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      "boxLength": false,
      "boxWidth": false,
      "boxHeight": false,
      "lastUpdatedDate": false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    // Reset search error on each new search
    if (data.find((i) => i.sku?.includes(debouncedSearchTerm))) return;
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 4) {
      dispatch(fetchItemSearchQueryThunk(debouncedSearchTerm))
        .unwrap()
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleSearchInputChange = (e: any) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    table.getColumn("sku")?.setFilterValue(newValue);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter SKU's..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border w-full ">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(function (header) {

                  return ((header.id == "actions" && user.role === "admin") || header.id != "actions") ? (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ) : null;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map(function (row) {
       
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      ((cell.column.id == "actions" && user.role === "admin") || cell.column.id != "actions") ? <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell> : null
                    ))}
                  </TableRow>
                );
              })
              : !loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
