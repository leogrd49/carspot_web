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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface Profile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  phone: string;
  bio: string;
  followers_count: number;
  following_count: number;
  location_privacy: boolean;
  auto_save_photo: boolean;
  auto_publish_spot: boolean;
  premium_status: boolean;
  superspot_mode: boolean;
}

const ProfilesTable = () => {
  const [data, setData] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null); // État pour l'édition
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const columns: ColumnDef<Profile>[] = [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "phone",
      header: "Phone number",
    },
    {
      accessorKey: "followers_count",
      header: "Followers",
    },
    {
      accessorKey: "premium_status",
      header: "Premium",
      cell: ({ row }) => (row.getValue("premium_status") ? "Yes" : "No"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original)} // Ouvre la boîte de dialogue pour éditer
          >
            Edit
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
        .from("profiles")
        .select("*", { count: "exact" })
        .range(start, end)
        .ilike("username", `%${globalFilter}%`);

      if (error) throw error;

      setData(data as Profile[]);
      setTotalCount(count || 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching profiles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, sorting, globalFilter]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile); // Met à jour l'état avec le profil sélectionné
    setIsDialogOpen(true); // Ouvre la boîte de dialogue
  };

  const handleSave = async (profile: Partial<Profile>) => {
    try {
      const sanitizedProfile = {
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        bio: profile.bio,
        followers_count: profile.followers_count || 0,
        following_count: profile.following_count || 0,
        location_privacy: profile.location_privacy || false,
        auto_save_photo: profile.auto_save_photo || false,
        auto_publish_spot: profile.auto_publish_spot || false,
        premium_status: profile.premium_status || false,
        superspot_mode: profile.superspot_mode || false,
      };

      let response;
      if (editingProfile) {
        response = await supabase
          .from("profiles")
          .update(sanitizedProfile)
          .eq("id", editingProfile.id); // Mise à jour basée sur l'ID
      } else {
        response = await supabase.from("profiles").insert(sanitizedProfile); // Ajout d'un nouveau profil
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setIsDialogOpen(false); // Ferme la boîte de dialogue
      fetchData(); // Recharge les données
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Profiles Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
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

      {/* Dialog for editing/creating */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Edit Profile" : "New Profile"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const profileData = Object.fromEntries(formData) as Partial<Profile>;
              handleSave(profileData);
            }}
          >
            <div className="space-y-4">
            <Input
                name="username"
                placeholder="Username"
                defaultValue={editingProfile?.username || ""}
              />
              <Input
                name="first_name"
                placeholder="First Name"
                defaultValue={editingProfile?.first_name || ""}
              />
              <Input
                name="last_name"
                placeholder="Last Name"
                defaultValue={editingProfile?.last_name || ""}
              />
              <Input
                name="avatar_url"
                placeholder="Avatar Url"
                defaultValue={editingProfile?.avatar_url || ""}
              />
              <Input
                name="phone"
                placeholder="Phone"
                defaultValue={editingProfile?.phone || ""}
              />
              <Input
                name="bio"
                placeholder="Bio"
                defaultValue={editingProfile?.bio || ""}
              />
              <Input
                name="followers_count"
                placeholder="Followers"
                type="number"
                defaultValue={editingProfile?.followers_count || 0}
              />
              <label className="flex items-center space-x-2">
                <input
                  name="location_privacy"
                  type="checkbox"
                  defaultChecked={editingProfile?.location_privacy || false}
                />
                <span>Location Privacy</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  name="auto_save_photo"
                  type="checkbox"
                  defaultChecked={editingProfile?.auto_save_photo || false}
                />
                <span>Auto Save Photo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  name="auto_publish_spot"
                  type="checkbox"
                  defaultChecked={editingProfile?.auto_publish_spot || false}
                />
                <span>Auto Publish Spot</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  name="premium_status"
                  type="checkbox"
                  defaultChecked={editingProfile?.premium_status || false}
                />
                <span>Premium</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  name="superspot_mode"
                  type="checkbox"
                  defaultChecked={editingProfile?.superspot_mode || false}
                />
                <span>Superspot Mode</span>
              </label>
              <Button type="submit">
                {editingProfile ? "Save Changes" : "Create Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfilesTable;
