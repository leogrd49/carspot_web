"use client";

import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface AdmobLog {
  id: number;
  app_version: string;
  platform: string;
  event_type: "AD_FAILED" | "AD_LOADED" | "INIT_START" | "AD_SKIP" | "CONFIG_START" | "INIT_SUCCESS";
  message: string;
  created_at: string;
}

const AdmobLogsTable = () => {
  const [data, setData] = useState<AdmobLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  const eventColors = {
    AD_FAILED: "bg-red-100 text-red-600",
    AD_LOADED: "bg-green-100 text-green-600",
    INIT_START: "bg-blue-100 text-blue-600",
    AD_SKIP: "bg-yellow-100 text-yellow-600",
    CONFIG_START: "bg-purple-100 text-purple-600",
    INIT_SUCCESS: "bg-teal-100 text-teal-600",
  };

  const columns: ColumnDef<AdmobLog>[] = [
    {
      accessorKey: "app_version",
      header: "App Version",
    },
    {
      accessorKey: "platform",
      header: "Platform",
    },
    {
      accessorKey: "event_type",
      header: "Event Type",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded ${
            eventColors[row.original.event_type] || "bg-gray-100 text-gray-600"
          }`}
        >
          {row.original.event_type}
        </span>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <span title={row.original.message}>
          {row.original.message.length > 50
            ? row.original.message.substring(0, 50) + "..."
            : row.original.message}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2" size={16} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2" size={16} />
          ) : (
            <ArrowUpDown className="ml-2" size={16} />
          )}
        </div>
      ),
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleString("fr-FR"),
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const start = pageIndex * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from("admob_logs")
        .select("id, app_version, platform, event_type, message, created_at", {
          count: "exact",
        })
        .order("created_at", { ascending: sorting[0]?.desc ? false : true })
        .range(start, end);

      if (error) throw error;

      setData(data as AdmobLog[]);
      setTotalCount(count || 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching logs");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admob Logs Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
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
                      <TableRow key={row.id} className="hover:bg-gray-100">
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdmobLogsTable;
