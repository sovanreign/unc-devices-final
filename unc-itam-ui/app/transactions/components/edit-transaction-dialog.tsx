"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useUpdateTransaction } from "@/hooks/use-update-transaction";
import { Transaction } from "@/lib/models/transaction";
import { UpdateTransactionInput } from "@/lib/api/transactions";

const statuses = ["Pending", "Returned"] as const;

interface EditTransactionDialogProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function EditTransactionDialog({
  transaction,
  onClose,
}: EditTransactionDialogProps) {
  const updateTransaction = useUpdateTransaction();
  const [role, setRole] = useState<"Admin" | "Teacher" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTransactionInput>({
    defaultValues: {
      borrowerName: transaction.borrowerName ?? "",
      deviceId: transaction.deviceId,
      purpose: transaction.purpose,
      borrowedDate: new Date(transaction.borrowedDate),
      returnedDate: transaction.returnDate
        ? new Date(transaction.returnDate)
        : undefined,
      status: transaction.status,
    },
  });

  const borrowedDate = watch("borrowedDate");
  const returnDate = watch("returnedDate");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed.role);
      setUserId(parsed.id);
    }
  }, []);

  useEffect(() => {
    reset({
      borrowerName: transaction.borrowerName ?? "",
      deviceId: transaction.deviceId,
      purpose: transaction.purpose,
      borrowedDate: new Date(transaction.borrowedDate),
      returnedDate: transaction.returnDate
        ? new Date(transaction.returnDate)
        : undefined,
      status: transaction.status,
    });
  }, [transaction, reset]);

  const onSubmit = (data: UpdateTransactionInput) => {
    const payload: UpdateTransactionInput = {
      ...data,
      borrowerId: role === "Teacher" ? userId ?? undefined : undefined,
      borrowerName: role === "Admin" ? data.borrowerName : undefined,
    };

    updateTransaction.mutate(
      { id: transaction.id, data: payload },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {role === "Admin" && (
            <div className="space-y-1">
              <Label htmlFor="borrowerName">Borrower Name</Label>
              <Input
                id="borrowerName"
                {...register("borrowerName", {
                  required: "Borrower name is required",
                })}
                placeholder="e.g. Juan Dela Cruz"
              />
              {errors.borrowerName && (
                <p className="text-xs text-red-500">
                  {errors.borrowerName.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="deviceId">Device ID</Label>
            <Input
              id="deviceId"
              {...register("deviceId", { required: "Device ID is required" })}
            />
            {errors.deviceId && (
              <p className="text-xs text-red-500">{errors.deviceId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              {...register("purpose", { required: "Purpose is required" })}
            />
            {errors.purpose && (
              <p className="text-xs text-red-500">{errors.purpose.message}</p>
            )}
          </div>

          {/* Borrowed Date Picker */}
          <div className="space-y-1">
            <Label>Borrowed Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !borrowedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {borrowedDate ? format(borrowedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={borrowedDate}
                  onSelect={(date) => setValue("borrowedDate", date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Optional Return Date Picker */}
          <div className="space-y-1">
            <Label>Return Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => setValue("returnedDate", date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status", { required: "Status is required" })}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateTransaction.isPending}>
              {updateTransaction.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
