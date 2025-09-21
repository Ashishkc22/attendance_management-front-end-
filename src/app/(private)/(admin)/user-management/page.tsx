// app/users/page.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { fetchUsers } from "@/app/features/userManagement/userThunk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewUserDrawer } from "./new-user-drawer";
import {
  usersSelector
} from "@/app/features/userManagement/userSelectors";
import { useSelector,useDispatch } from "react-redux";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Inactive";
};

const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "Invited",
  },
  {
    id: 3,
    name: "Carol Lee",
    email: "carol@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 5,
    name: "Eva Wong",
    email: "eva@example.com",
    role: "Editor",
    status: "Active",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const usersState = useSelector(usersSelector);
  const dispatch = useDispatch()
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleInvite = (email: string) => {
    console.log(`Invited user: ${email}`);
  };

  useEffect(()=>{
    dispatch(fetchUsers())
  },[])

  return (
    <div className="p-6 space-y-6">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <NewUserDrawer>
          <Button><UserPlus />Invite User</Button>
        </NewUserDrawer>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Invited">Invited</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersState?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell> 
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="text-right">
                    {user.createdAt}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
