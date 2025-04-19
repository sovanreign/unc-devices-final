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
import { useEffect } from "react";
import { Device } from "@/lib/models/device";
import { UpdateDeviceInput } from "@/lib/api/devices";
import { useUpdateDevice } from "@/hooks/use-update-device";

interface EditDeviceDialogProps {
  device: Device;
  onClose: () => void;
}

const categories = ["Chromebook", "Tablet", "Router", "Speaker"] as const;
const statuses = ["Available", "InUse", "UnderRepair", "Lost"] as const;

export default function EditDeviceDialog({
  device,
  onClose,
}: EditDeviceDialogProps) {
  const updateDevice = useUpdateDevice();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateDeviceInput>({
    defaultValues: {
      model: device.model,
      serialNumber: device.serialNumber,
      tagNumber: device.tagNumber,
      category: device.category,
      status: device.status,
      remark: device.remark,
    },
  });

  useEffect(() => {
    reset({
      model: device.model,
      serialNumber: device.serialNumber,
      tagNumber: device.tagNumber,
      category: device.category,
      status: device.status,
      remark: device.remark,
    });
  }, [device, reset]);

  const onSubmit = (data: UpdateDeviceInput) => {
    const payload = { ...data };
    if (!payload.serialNumber?.trim()) {
      delete payload.serialNumber;
    }

    updateDevice.mutate(
      { id: device.id, data: payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="model">Device Model</Label>
            <Input
              id="model"
              {...register("model", { required: "Model is required" })}
              placeholder="e.g. iPad Pro"
            />
            {errors.model && (
              <p className="text-xs text-red-500">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="serial">Serial Number (optional)</Label>
            <Input
              id="serial"
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
            >
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

          <div className="space-y-1">
            <Label htmlFor="remark">Remarks (optional)</Label>
            <Input
              id="remark"
              {...register("remark")}
              placeholder="Notes, condition, etc."
            />
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateDevice.isPending}>
              {updateDevice.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
