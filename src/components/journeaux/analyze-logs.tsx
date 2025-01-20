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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface AnalyzeLog {
  id: number;
  result_type: "SUCCESS" | "ERROR";
  raw_response: string;
  analysis_time_ms: number;
  timestamp: string;
  make: string;
  model: string;
  phase: string;
  series: string;
  confidence_score: number;
}

const AnalyzeLogsTable = () => {
  const [data, setData] = useState<AnalyzeLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLog, setSelectedLog] = useState<AnalyzeLog | null>(null);

  const columns: ColumnDef<AnalyzeLog>[] = [
    {
      accessorKey: "result_type",
      header: "Result Type",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded ${
            row.original.result_type === "SUCCESS"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.original.result_type}
        </span>
      ),
    },
    {
      accessorKey: "raw_response",
      header: "Raw Response",
      cell: ({ row }) => (
        <span title={row.original.raw_response}>
          {row.original.raw_response.length > 50
            ? row.original.raw_response.substring(0, 50) + "..."
            : row.original.raw_response}
        </span>
      ),
    },
    {
      accessorKey: "analysis_time_ms",
      header: "Analysis Time (ms)",
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
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
        new Date(row.original.timestamp).toLocaleString("fr-FR"),
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const start = pageIndex * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from("analyze_logs")
        .select(
          "id, result_type, raw_response, analysis_time_ms, timestamp, make, model, phase, series, confidence_score",
          { count: "exact" }
        )
        .order("timestamp", { ascending: sorting[0]?.desc ? false : true })
        .range(start, end);

      if (error) throw error;

      setData(data as AnalyzeLog[]);
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
        <CardTitle>Analyze Logs Table</CardTitle>
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
                      <TableRow
                        key={row.id}
                        className={`${
                          row.original.result_type === "SUCCESS"
                            ? "cursor-pointer hover:bg-gray-100"
                            : "cursor-not-allowed bg-gray-50 text-gray-400"
                        }`}
                        onClick={() =>
                          row.original.result_type === "SUCCESS" &&
                          setSelectedLog(row.original)
                        }
                      >
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

      {/* Dialog for showing details */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-2">
              <p>
                <strong>Make:</strong> {selectedLog.make}
              </p>
              <p>
                <strong>Model:</strong> {selectedLog.model}
              </p>
              <p>
                <strong>Phase:</strong> {selectedLog.phase}
              </p>
              <p>
                <strong>Series:</strong> {selectedLog.series}
              </p>
              <p>
                <strong>Confidence Score:</strong> {selectedLog.confidence_score}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AnalyzeLogsTable;
