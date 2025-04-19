"use client";

import Body from "@/components/body";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import AddTransactionDialog from "./components/add-transaction-dialog";
import EditTransactionDialog from "./components/edit-transaction-dialog";
// import DeleteTransactionDialog from "./components/delete-transaction-dialog";
import { useTransactions } from "@/hooks/use-transactions";
import { Transaction } from "@/lib/models/transaction";
import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import DeleteTransactionDialog from "./components/delete-transaction-dialog";

export default function Page() {
  const { data: transactions = [], isLoading } = useTransactions();

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  return (
    <Body crumbs={[{ label: "Transactions", href: "/" }]}>
      <div className="flex items-center justify-between w-full mt-4">
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
            onChange={(e) => console.log(e.target.value)}
          />
        </div>

        <Link href="/transactions/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto mt-4 mx-2">
        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading transactions...
          </div>
        ) : (
          <Table className="w-full text-sm text-left">
            <TableHeader className="border-b">
              <TableRow>
                <TableHead className="py-3">Borrower</TableHead>
                <TableHead className="py-3">Device</TableHead>
                <TableHead className="py-3">Status</TableHead>
                <TableHead className="py-3">Purpose</TableHead>
                <TableHead className="py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id} className="border-b hover:bg-muted/50">
                    <TableCell className="py-3">
                      {txn.borrowerName || txn.borrower?.name || "N/A"}
                    </TableCell>
                    <TableCell className="py-3">
                      {txn.device?.model || "N/A"}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          txn.status === "Returned"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">{txn.purpose}</TableCell>
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/transactions/${txn.id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/transactions/${txn.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setTransactionToDelete(txn)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {transactionToDelete && (
        <DeleteTransactionDialog
          transaction={transactionToDelete}
          open={!!transactionToDelete}
          onClose={() => setTransactionToDelete(null)}
        />
      )}
    </Body>
  );
}
