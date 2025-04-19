"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTransaction } from "@/lib/api/transactions";
import { Transaction } from "@/lib/models/transaction";
import { format } from "date-fns";

import Body from "@/components/body";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CalendarDays,
  User2,
  Laptop2,
  Clock4,
  Pencil,
  CheckCircle,
} from "lucide-react";
import { useUpdateTransaction } from "@/hooks/use-update-transaction";

export default function TransactionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const updateTransaction = useUpdateTransaction();

  useEffect(() => {
    const fetch = async () => {
      const data = await getTransaction(id as string);
      setTransaction(data);
    };
    fetch();
  }, [id]);

  const handleMarkAsReturned = () => {
    if (!transaction) return;

    updateTransaction.mutate(
      {
        id: transaction.id,
        data: {
          returnedDate: new Date(),
        },
      },
      {
        onSuccess: () => {
          getTransaction(transaction.id).then(setTransaction);
        },
      }
    );
  };

  return (
    <Body
      crumbs={[
        { label: "Transactions", href: "/transactions" },
        { label: "Details", href: "" },
      ]}
    >
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transaction Details</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/transactions/${id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {!transaction?.returnedDate && (
              <Button
                variant="default"
                onClick={handleMarkAsReturned}
                disabled={updateTransaction.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {updateTransaction.isPending
                  ? "Marking..."
                  : "Mark as Returned"}
              </Button>
            )}
          </div>
        </div>

        {!transaction ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Loading transaction...
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Laptop2 className="h-5 w-5 text-muted-foreground" />
                {transaction.device?.model ?? "Device"}
                <Badge variant="outline" className="ml-2">
                  {transaction.status}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Borrower</p>
                  <p className="font-medium flex items-center gap-1">
                    <User2 className="h-4 w-4" />
                    {transaction.borrowerName ||
                      transaction.borrower?.name ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Device</p>
                  <p className="font-medium">
                    {transaction.device?.model} ({transaction.device?.tagNumber}
                    )
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Purpose</p>
                  <p className="font-medium">{transaction.purpose}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Borrowed Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {format(new Date(transaction.borrowedDate), "PPP")}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Returned Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {transaction.returnedDate
                      ? format(new Date(transaction.returnedDate), "PPP")
                      : "Not yet returned"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Created At</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock4 className="h-4 w-4" />
                    {format(new Date(transaction.createdAt), "PPPp")}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Updated At</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock4 className="h-4 w-4" />
                    {format(new Date(transaction.updatedAt), "PPPp")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Body>
  );
}
