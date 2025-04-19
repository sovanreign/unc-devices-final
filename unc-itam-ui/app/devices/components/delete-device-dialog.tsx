"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteDevice } from "@/hooks/use-delete-device";
import { Device } from "@/lib/models/device";

interface DeleteDeviceDialogProps {
  device: Device;
  open: boolean;
  onClose: () => void;
}

export default function DeleteDeviceDialog({
  device,
  open,
  onClose,
}: DeleteDeviceDialogProps) {
  const deleteDevice = useDeleteDevice();

  const handleDelete = () => {
    deleteDevice.mutate(device.id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Device</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{device.model}</strong>? This
          action cannot be undone.
        </p>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteDevice.isPending}
          >
            {deleteDevice.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
