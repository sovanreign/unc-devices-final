"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { CreateTransactionInput } from "@/lib/api/transactions";
import { useCreateTransaction } from "@/hooks/use-create-transaction";
import { useDevices } from "@/hooks/use-devices";
import { cn } from "@/lib/utils";

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
import Body from "@/components/body"; // ✅ your shared layout component

export default function CreateTransactionPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Admin" | "Teacher" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [devicePopoverOpen, setDevicePopoverOpen] = useState(false);

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
    defaultValues: {
      borrowedDate: new Date(),
    },
  });

  const borrowedDate = watch("borrowedDate");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed.role);
      setUserId(parsed.sub);
    }
  }, []);

  const onSubmit = (data: CreateTransactionInput) => {
    const payload: CreateTransactionInput = {
      ...data,
      borrowerId: role === "Teacher" ? userId ?? undefined : undefined,
      borrowerName: role === "Admin" ? data.borrowerName : undefined,
    };

    createTransaction.mutate(payload, {
      onSuccess: () => {
        router.push("/transactions");
      },
    });
  };

  return (
    <Body
      crumbs={[
        { label: "Transactions", href: "/transactions" },
        { label: "Create", href: "" },
      ]}
    >
      <div className=" px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Create Transaction</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <CommandEmpty>No devices found.</CommandEmpty>
                  <CommandGroup>
                    {devices
                      .filter((device) => device.status === "Available")
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
              <p className="text-xs text-red-500">{errors.deviceId.message}</p>
            )}
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

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/transactions")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTransaction.isPending}>
              {createTransaction.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Body>
  );
}
