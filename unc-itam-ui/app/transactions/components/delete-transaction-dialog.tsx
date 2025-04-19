"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTransaction } from "@/hooks/use-delete-transaction";
import { Transaction } from "@/lib/models/transaction";

interface Props {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}

export default function DeleteTransactionDialog({
  transaction,
  open,
  onClose,
}: Props) {
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = () => {
    deleteTransaction.mutate(transaction.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this transaction for{" "}
          <strong>
            {transaction.borrowerName ||
              transaction.borrower?.name ||
              "this user"}
          </strong>
          ?<br />
          This action cannot be undone.
        </p>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTransaction.isPending}
          >
            {deleteTransaction.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
