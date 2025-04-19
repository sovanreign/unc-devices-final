"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateTransaction } from "@/hooks/use-create-transaction";
import { CreateTransactionInput } from "@/lib/api/transactions";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useDevices } from "@/hooks/use-devices";

export default function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"Admin" | "Teacher" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [devicePopoverOpen, setDevicePopoverOpen] = useState(false);
  const [selectedDeviceTag, setSelectedDeviceTag] = useState<string | null>(
    null
  );

  const { data: devices = [] } = useDevices();
  const createTransaction = useCreateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionInput>({
    defaultValues: { borrowedDate: new Date() },
    shouldUnregister: true,
  });

  const borrowedDate = watch("borrowedDate");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed.role);
      setUserId(parsed.id);
    }
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        reset({ borrowedDate: new Date() });
      });
    }
  }, [open, reset]);

  const onSubmit = (data: CreateTransactionInput) => {
    const payload: CreateTransactionInput = {
      ...data,
      borrowerId: role === "Teacher" ? userId ?? undefined : undefined,
      borrowerName: role === "Admin" ? data.borrowerName : undefined,
    };

    createTransaction.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        reset();
        setSelectedDeviceTag(null);
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
    setSelectedDeviceTag(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>

      {open && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
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

            {/* DEVICE TAG SELECTOR */}
            <div className="space-y-1">
              <Label>Select Device</Label>
              <Popover
                open={devicePopoverOpen}
                onOpenChange={setDevicePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedDeviceTag && "text-muted-foreground"
                    )}
                  >
                    {selectedDeviceTag ?? "Select device tag number"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search tag number..." />
                    <CommandEmpty>No devices found.</CommandEmpty>
                    <CommandGroup>
                      {devices.map((device) => (
                        <CommandItem
                          key={device.id}
                          value={device.tagNumber}
                          onSelect={() => {
                            setValue("deviceId", device.id); // ✅ Sets hidden deviceId input
                            setSelectedDeviceTag(device.tagNumber); // ✅ Updates visual label
                            setDevicePopoverOpen(false); // ✅ Closes popover
                          }}
                        >
                          {device.tagNumber} — {device.model}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.deviceId && (
                <p className="text-xs text-red-500">
                  {errors.deviceId.message}
                </p>
              )}
              <input
                type="hidden"
                {...register("deviceId", { required: "Device is required" })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                {...register("purpose", { required: "Purpose is required" })}
                placeholder="e.g. Presentation"
              />
              {errors.purpose && (
                <p className="text-xs text-red-500">{errors.purpose.message}</p>
              )}
            </div>

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
                    onSelect={(date) => {
                      setValue("borrowedDate", date!, { shouldValidate: true });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTransaction.isPending}>
                {createTransaction.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
