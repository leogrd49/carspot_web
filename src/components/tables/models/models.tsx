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
import { ArrowUpDown, Trash, Filter } from "lucide-react";

interface Model {
  id: number;
  brands_id: number;
  brand_name: string;
  name: string;
  price: number;
  series: string;
  variant: string;
  rarity: string;
  type?: string; // Nouveau champ optionnel pour le type de véhicule
  engine?: string;
  horsepower?: number;
  torque?: number;
  curb_weight?: number;
  acceleration_0_100?: number;
  top_speed?: number;
  phase?: string;
  commercial_start_date?: string;
  commercial_end_date?: string;
  generation_name?: string;
  length?: number;
  width?: number;
  height?: number;
  trunk_volume_min?: number;
  trunk_volume_max?: number;
  doors?: number;
  seats?: number;
  engine_type?: string;
  fiscal_power?: number;
  engine_description?: string;
  displacement?: number;
  horsepower_rpm?: number;
  transmission?: string;
  transmission_gears?: number;
  drivetrain?: string;
  fuel_consumption_avg?: number;
  fuel_tank_capacity?: number;
  co2_emission?: number;
  brake_type?: string;
  trim?: string;
  production_count?: number;
}

const ModelsTable = () => {
  const [data, setData] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>(""); // Nouvel état pour gérer le filtre de type


   // Options disponibles pour les types de véhicules
  const vehicleTypes = [
    { value: "", label: "Tous les types" },
    { value: "voiture", label: "Voitures" },
    { value: "camion", label: "Camions" },
  ];

  const rarityColors: Record<string, string> = {
    common: "bg-gray-100 text-gray-800",
    uncommon: "bg-green-100 text-green-800",
    rare: "bg-blue-100 text-blue-800",
    very_rare: "bg-purple-100 text-purple-800",
    legendary: "bg-yellow-100 text-yellow-800",
    mythic: "bg-red-100 text-red-800",
  };

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "brand_name",
      header: "Brand",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.getValue("price").toLocaleString()}`,
    },
    {
      accessorKey: "series",
      header: "Series",
    },
    {
      accessorKey: "variant",
      header: "Variant",
    },
    {
      accessorKey: "rarity",
      header: "Rarity",
      cell: ({ row }) => {
        const rarity = row.getValue("rarity");
        return (
          <span className={`px-2 py-1 rounded ${rarityColors[rarity] || "bg-gray-100 text-gray-800"}`}>
            {rarity}
          </span>
        );
      },
    },
    // Ajout de la colonne type dans la définition des colonnes
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Non défini";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
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

  // Modification de la fonction fetchData pour inclure le filtre de type
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const start = pageIndex * pageSize;
      const end = start + pageSize - 1;

      let query = supabase
        .from("models")
        .select(
          "id, name, price, series, variant, rarity, brands!inner(name), type", // Ajout du champ type
          { count: "exact" }
        );

    // Application du filtre de type si un type est sélectionné
      if (selectedType) {
        query = query.eq('type', selectedType);
      }

      query = query.range(start, end);

      const { data: fetchedData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      const transformedData = (fetchedData || []).map((item: any) => ({
        ...item,
        brand_name: item.brands?.name || "Unknown",
      }));

      setData(transformedData as Model[]);
      setTotalCount(count || 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching models");
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout de selectedType dans les dépendances pour recharger les données quand le filtre change
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, sorting, selectedType]);

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

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setIsDialogOpen(true);
  };

  const handleSave = async (model: Partial<Model>) => {
    try {
      let response;
      if (editingModel) {
        response = await supabase
          .from("models")
          .update(model)
          .eq("id", editingModel.id);
      } else {
        response = await supabase.from("models").insert(model);
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving model:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("models").delete().eq("id", id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Models Table</CardTitle>
          <Button onClick={() => { setEditingModel(null); setIsDialogOpen(true); }}>
            New Model
          </Button>
        </div>


        {/* Ajout du filtre de type */}
        <div className="flex items-center space-x-2">
          <Filter size={16} /> {/* Icône de filtre */}
          <select
            className="px-3 py-2 border rounded-md w-[200px]"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {vehicleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModel ? "Edit Model" : "New Model"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const modelData = Object.fromEntries(formData) as Partial<Model>;
              handleSave(modelData);
            }}
          >
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="Name"
                defaultValue={editingModel?.name || ""}
              />
              <Input
                name="price"
                placeholder="Price"
                type="number"
                defaultValue={editingModel?.price || ""}
              />
              <Input
                name="series"
                placeholder="Series"
                defaultValue={editingModel?.series || ""}
              />
              <Input
                name="variant"
                placeholder="Variant"
                defaultValue={editingModel?.variant || ""}
              />
              <Input
                name="rarity"
                placeholder="Rarity"
                defaultValue={editingModel?.rarity || ""}
              />
                {/* Ajout du select pour le type dans le formulaire */}
              <select
                name="type"
                defaultValue={editingModel?.type || ""}
                className="w-full px-3 py-2 border rounded-md"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <Button type="submit">
                {editingModel ? "Save Changes" : "Create Model"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ModelsTable;
