"use client";

import Body from "@/components/body";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { MdPerson } from "react-icons/md";
import AddDeviceDialog from "./components/add-user-dialog";
import { User } from "@/lib/models/user";
import { useUsers } from "@/hooks/use-users";
import EditUserDialog from "./components/edit-user-dialog";
import { useState } from "react";
import DeleteUserDialog from "./components/delete-user-dialog";

export default function Page() {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useUsers(search);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  return (
    <Body crumbs={[{ label: "Users", href: "/" }]}>
      <div className="flex items-center justify-between w-full mt-4">
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <AddDeviceDialog />
      </div>

      <div className="overflow-x-auto mt-4 mx-2">
        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : (
          <Table className="w-full text-sm text-left">
            <TableHeader className="border-b">
              <TableRow>
                <TableHead className="py-3">Employee ID</TableHead>
                <TableHead className="py-3">Name</TableHead>
                <TableHead className="py-3">Email</TableHead>
                <TableHead className="py-3">Role</TableHead>
                <TableHead className="py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="py-3 flex items-center gap-2">
                      <MdPerson className="text-muted-foreground h-6 w-6" />
                      {user.employeeId}
                    </TableCell>
                    <TableCell className="py-3">{user.name}</TableCell>
                    <TableCell className="py-3">{user.email}</TableCell>
                    <TableCell className="py-3">{user.role}</TableCell>
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedUser(user)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteUser(user)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          open={!!deleteUser}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </Body>
  );
}
