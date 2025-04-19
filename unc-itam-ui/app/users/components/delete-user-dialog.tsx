"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/use-delete-user";
import { User } from "@/lib/models/user";

interface DeleteUserDialogProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export default function DeleteUserDialog({
  user,
  open,
  onClose,
}: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser();

  const handleDelete = () => {
    deleteUser.mutate(user.id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{user.name}</strong>? This
          action cannot be undone.
        </p>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
