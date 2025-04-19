"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

import { getTransaction, UpdateTransactionInput } from "@/lib/api/transactions";
import { useUpdateTransaction } from "@/hooks/use-update-transaction";
import { useDevices } from "@/hooks/use-devices";
import { cn } from "@/lib/utils";

import Body from "@/components/body";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Transaction } from "@/lib/models/transaction";

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [role, setRole] = useState<"Admin" | "Teacher" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [devicePopoverOpen, setDevicePopoverOpen] = useState(false);

  const { data: devices = [] } = useDevices();
  const updateTransaction = useUpdateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTransactionInput>({
    shouldUnregister: true,
  });

  const borrowedDate = watch("borrowedDate");
  const returnedDate = watch("returnedDate");

  useEffect(() => {
    const load = async () => {
      const tx = await getTransaction(transactionId);
      setTransaction(tx);

      setSelectedTag(tx.device?.tagNumber ?? null);
      setValue("deviceId", tx.deviceId);
      setValue("purpose", tx.purpose);
      setValue("borrowedDate", new Date(tx.borrowedDate));
      if (tx.returnedDate) setValue("returnedDate", new Date(tx.returnedDate));
      if (tx.borrowerName) setValue("borrowerName", tx.borrowerName);
    };

    load();
  }, [transactionId, setValue]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed.role);
      setUserId(parsed.id);
    }
  }, []);

  const onSubmit = (data: UpdateTransactionInput) => {
    const payload: UpdateTransactionInput = {
      ...data,
      borrowerId: role === "Teacher" ? userId ?? undefined : undefined,
      borrowerName: role === "Admin" ? data.borrowerName : undefined,
    };

    updateTransaction.mutate(
      { id: transactionId, data: payload },
      {
        onSuccess: () => {
          router.push("/transactions");
        },
      }
    );
  };

  return (
    <Body
      crumbs={[
        { label: "Transactions", href: "/transactions" },
        { label: "Edit", href: "" },
      ]}
    >
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Edit Transaction</h1>

        {!transaction ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {role === "Admin" && (
              <div className="space-y-1">
                <Label htmlFor="borrowerName">Borrower Name</Label>
                <Input
                  id="borrowerName"
                  {...register("borrowerName", {
                    required: "Borrower name is required",
                  })}
                />
                {errors.borrowerName && (
                  <p className="text-xs text-red-500">
                    {errors.borrowerName.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <Label>Select Device (Tag Number)</Label>
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
                      !selectedTag && "text-muted-foreground"
                    )}
                  >
                    {selectedTag ?? "Select device"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search tag number..." />
                    <CommandEmpty>No available devices.</CommandEmpty>
                    <CommandGroup>
                      {devices
                        .filter(
                          (d) =>
                            d.status === "Available" ||
                            d.id === transaction?.deviceId
                        )
                        .map((device) => (
                          <CommandItem
                            key={device.id}
                            value={device.tagNumber}
                            onSelect={() => {
                              setValue("deviceId", device.id, {
                                shouldValidate: true,
                              });
                              setSelectedTag(device.tagNumber);
                              setDevicePopoverOpen(false);
                            }}
                          >
                            {device.tagNumber} — {device.model}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                {...register("deviceId", { required: "Device is required" })}
              />
              {errors.deviceId && (
                <p className="text-xs text-red-500">
                  {errors.deviceId.message}
                </p>
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

            {/* Borrowed Date */}
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
                    onSelect={(date) =>
                      setValue("borrowedDate", date!, { shouldValidate: true })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.borrowedDate && (
                <p className="text-xs text-red-500">
                  {errors.borrowedDate.message}
                </p>
              )}
            </div>

            {/* ✅ Returned Date (was previously returnDate) */}
            <div className="space-y-1">
              <Label>Returned Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !returnedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnedDate ? format(returnedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnedDate}
                    onSelect={(date) =>
                      setValue("returnedDate", date!, { shouldValidate: true })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.returnedDate && (
                <p className="text-xs text-red-500">
                  {errors.returnedDate.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/transactions")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTransaction.isPending}>
                {updateTransaction.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Body>
  );
}
