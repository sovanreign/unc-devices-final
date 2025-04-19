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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateDeviceInput } from "@/lib/api/devices";
import { useCreateDevice } from "@/hooks/use-create-device";
import { useState } from "react";

const categories = ["Chromebook", "Tablet", "Router", "Speaker"] as const;
const statuses = ["Available", "InUse", "UnderRepair", "Lost"] as const;

export default function AddDeviceDialog() {
  const [open, setOpen] = useState(false);
  const createDevice = useCreateDevice();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDeviceInput>();

  const onSubmit = (data: CreateDeviceInput) => {
    createDevice.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="model">Device Model</Label>
            <Input
              id="model"
              {...register("model", { required: "Device model is required" })}
              placeholder="e.g. MacBook Air"
            />
            {errors.model && (
              <p className="text-xs text-red-500">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="serialNumber">Serial Number (optional)</Label>
            <Input
              id="serialNumber"
              {...register("serialNumber")}
              placeholder="e.g. SN123456"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tagNumber">Tag Number</Label>
            <Input
              id="tagNumber"
              {...register("tagNumber", { required: "Tag number is required" })}
              placeholder="e.g. TAG001"
            />
            {errors.tagNumber && (
              <p className="text-xs text-red-500">{errors.tagNumber.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status", { required: "Status is required" })}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
              defaultValue=""
            >
              <option value="" disabled>
                Select status
              </option>
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

          <div className="space-y-1">
            <Label htmlFor="remark">Remarks (optional)</Label>
            <Input
              id="remark"
              {...register("remark")}
              placeholder="Any additional notes"
            />
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDevice.isPending}>
              {createDevice.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
