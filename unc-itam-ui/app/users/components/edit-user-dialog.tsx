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
import { UpdateUserInput } from "@/lib/api/users";
import { useUpdateUser } from "@/hooks/use-update-user";
import { User } from "@/lib/models/user";
import { useEffect } from "react";

interface EditUserDialogProps {
  user: User;
  onClose?: () => void;
}

export default function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });
  }, [user, reset]);

  const onSubmit = (data: UpdateUserInput) => {
    const payload = { ...data };

    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    updateUser.mutate(
      { id: user.id, data: payload },
      {
        onSuccess: () => {
          onClose?.();
        },
      }
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-2">
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              {...register("employeeId", {
                required: "Employee ID is required",
              })}
              placeholder="Enter employee ID"
            />
            {errors.employeeId && (
              <p className="text-xs text-red-500">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
