"use client";

import Body from "@/components/body";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDevices } from "@/hooks/use-devices";
import { useTransactions } from "@/hooks/use-transactions";
import { DeviceStatus, Category } from "@/lib/models/device";
import { Transaction } from "@/lib/models/transaction";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<DeviceStatus, string> = {
  Available: "text-green-600",
  InUse: "text-yellow-600",
  UnderRepair: "text-orange-600",
  Lost: "text-red-600",
};

export default function DashboardPage() {
  const { data: devices = [], isLoading: loadingDevices } = useDevices();
  const { data: transactions = [], isLoading: loadingTransactions } =
    useTransactions();

  const countByStatus = (status: DeviceStatus) =>
    devices.filter((device) => device.status === status).length;

  const countByCategory = (category: Category) =>
    devices.filter((device) => device.category === category).length;

  const statuses: DeviceStatus[] = [
    "Available",
    "InUse",
    "UnderRepair",
    "Lost",
  ];
  const categories: Category[] = ["Chromebook", "Tablet", "Router", "Speaker"];

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.borrowedDate).getTime() - new Date(a.borrowedDate).getTime()
    )
    .slice(0, 5);

  const devicesWithIssues = devices.filter(
    (d) => d.status === "Lost" || d.status === "UnderRepair"
  );

  return (
    <Body crumbs={[{ label: "Dashboard", href: "/dashboard" }]}>
      <h1 className="text-2xl font-bold mb-6">Device Dashboard</h1>

      {loadingDevices || loadingTransactions ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          Loading dashboard data...
        </div>
      ) : (
        <div className="space-y-10">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((status) => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className={`text-sm ${statusColors[status]}`}>
                    {status}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{countByStatus(status)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Device Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-sm">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {countByCategory(category)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTransactions.map((txn: Transaction) => (
                <Card key={txn.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {txn.borrowerName || txn.borrower?.name || "Unknown User"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">
                        Device:
                      </span>{" "}
                      {txn.device?.model || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Purpose:
                      </span>{" "}
                      {txn.purpose}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Status:
                      </span>{" "}
                      {txn.status}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Borrowed:
                      </span>{" "}
                      {formatDistanceToNow(new Date(txn.borrowedDate), {
                        addSuffix: true,
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Devices with Issues */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Devices Needing Attention
            </h2>
            {devicesWithIssues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All devices are in good status.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devicesWithIssues.map((device) => (
                  <Card key={device.id}>
                    <CardHeader>
                      <CardTitle className="text-sm text-destructive">
                        {device.model}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium text-foreground">
                          Status:
                        </span>{" "}
                        {device.status}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Category:
                        </span>{" "}
                        {device.category}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Tag:
                        </span>{" "}
                        {device.tagNumber}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Remarks:
                        </span>{" "}
                        {device.remark || "None"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Body>
  );
}
