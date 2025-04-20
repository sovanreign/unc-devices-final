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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { Transaction } from "@/lib/models/transaction";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import DeleteTransactionDialog from "./components/delete-transaction-dialog";

export default function Page() {
  const { data: transactions = [], isLoading } = useTransactions();

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const handleDownloadPdf = () => {
    if (!transactions.length) return;

    // Landscape + A4
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(14);
    doc.text("Transactions Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Borrower",
          "Device",
          "Tag Number",
          "Status",
          "Purpose",
          "Borrowed Date",
          "Returned Date",
        ],
      ],
      body: transactions.map((txn) => [
        txn.borrowerName || txn.borrower?.name || "N/A",
        txn.device?.model || "N/A",
        txn.device?.tagNumber || "N/A",
        txn.status,
        txn.purpose,
        format(new Date(txn.borrowedDate), "yyyy-MM-dd"),
        txn.returnedDate
          ? format(new Date(txn.returnedDate), "yyyy-MM-dd")
          : "Not Returned",
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 101, 52] },
    });

    doc.save("transactions.pdf");
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"Admin" | "Teacher" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed.sub);
      setRole(parsed.role);
    }
  }, []);

  const visibleTransactions =
    role === "Teacher"
      ? transactions.filter((txn) => txn.borrowerId === userId)
      : transactions;

  return (
    <Body crumbs={[{ label: "Transactions", href: "/" }]}>
      <div className="flex items-center justify-between w-full mt-4">
        <div className="relative max-w-sm">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
            onChange={(e) => console.log(e.target.value)}
          /> */}
        </div>

        <div className="flex gap-2">
          {role === "Admin" && (
            <Button variant="outline" onClick={handleDownloadPdf}>
              Download PDF
            </Button>
          )}
          <Link href="/transactions/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>
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
              {visibleTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                visibleTransactions.map((txn) => (
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
