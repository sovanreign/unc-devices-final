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
import { Search, MoreHorizontal } from "lucide-react";
import { MdDevices } from "react-icons/md";

import { useState } from "react";
import { Device } from "@/lib/models/device";
import { useDevices } from "@/hooks/use-devices";
import AddDeviceDialog from "./components/add-device-dialog";
import EditDeviceDialog from "./components/edit-device-dialog";
import DeleteDeviceDialog from "./components/delete-device-dialog";

export default function Page() {
  const [search, setSearch] = useState("");
  const { data: devices = [], isLoading } = useDevices(search);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  return (
    <Body crumbs={[{ label: "Devices", href: "/" }]}>
      <div className="flex items-center justify-between w-full mt-4">
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <Input
            type="search"
            placeholder="Search devices..."
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
            Loading devices...
          </div>
        ) : (
          <Table className="w-full text-sm text-left">
            <TableHeader className="border-b">
              <TableRow>
                <TableHead className="py-3">Model</TableHead>
                <TableHead className="py-3">Serial Number</TableHead>
                <TableHead className="py-3">Tag Number</TableHead>
                <TableHead className="py-3">Category</TableHead>
                <TableHead className="py-3">Status</TableHead>
                <TableHead className="py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No devices found.
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow
                    key={device.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="py-3 flex items-center gap-2">
                      <MdDevices className="text-muted-foreground h-6 w-6" />
                      {device.model}
                    </TableCell>
                    <TableCell className="py-3">
                      {device.serialNumber ? (
                        device.serialNumber
                      ) : (
                        <span className="italic text-muted-foreground">
                          No serial number
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">{device.tagNumber}</TableCell>
                    <TableCell className="py-3">{device.category}</TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          device.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : device.status === "InUse"
                            ? "bg-yellow-100 text-yellow-800"
                            : device.status === "UnderRepair"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {device.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedDevice(device)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeviceToDelete(device)}
                          >
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

      {/* Dialogs */}
      {selectedDevice && (
        <EditDeviceDialog
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
      {deviceToDelete && (
        <DeleteDeviceDialog
          device={deviceToDelete}
          open={!!deviceToDelete}
          onClose={() => setDeviceToDelete(null)}
        />
      )}
    </Body>
  );
}
