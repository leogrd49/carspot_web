"use client";

import { useState, useEffect } from "react";
import supabase from "../../../../utils/supabase";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpDown, ArrowUp, ArrowDown, Trash } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  country: string;
}

const BrandsTable = () => {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2" size={16} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2" size={16} />
          ) : (
            <ArrowUpDown className="ml-2" size={16} />
          )}
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Country
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2" size={16} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2" size={16} />
          ) : (
            <ArrowUpDown className="ml-2" size={16} />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {/* Bouton Edit */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          {/* Bouton Delete */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-500 border-red-500"
          >
            <Trash size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const start = pageIndex * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from("brands")
        .select("*", { count: "exact" })
        .range(start, end);

      if (error) throw error;

      setData(data as Brand[]);
      setTotalCount(count || 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching brands");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, sorting]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const handleSave = async (brand: Partial<Brand>) => {
    try {
      let response;
      if (editingBrand) {
        // Update
        response = await supabase
          .from("brands")
          .update({ name: brand.name, country: brand.country })
          .eq("id", editingBrand.id);
      } else {
        // Create
        response = await supabase.from("brands").insert({
          name: brand.name,
          country: brand.country,
        });
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("brands").delete().eq("id", id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Brands Table</CardTitle>
        <Button onClick={() => { setEditingBrand(null); setIsDialogOpen(true); }}>
          New Brand
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pageIndex + 1} of {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex + 1 >= Math.ceil(totalCount / pageSize)}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Dialog for creating/editing */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "New Brand"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const brandData = Object.fromEntries(formData) as Partial<Brand>;
              handleSave(brandData);
            }}
          >
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="Name"
                defaultValue={editingBrand?.name || ""}
              />
              <Input
                name="country"
                placeholder="Country"
                defaultValue={editingBrand?.country || ""}
              />
              <Button type="submit">
                {editingBrand ? "Save Changes" : "Create Brand"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BrandsTable;
