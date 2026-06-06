"use client"

import { useState } from "react"
import { Eye, ArrowLeft } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatINR } from "@/lib/data"
import { useStore } from "@/lib/store-context"
import { PurchaseOrderView } from "../purchase-orders/page"

export default function InvoicesPage() {
  const { invoices } = useStore()
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null)

  if (selectedPoId) {
    return (
      <>
        <Topbar title="Invoice Details" />
        <div className="border-b bg-background px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedPoId(null)}>
            <ArrowLeft className="mr-2 size-4" /> Back to List
          </Button>
        </div>
        <PurchaseOrderView defaultTab="invoice" poId={selectedPoId} />
      </>
    )
  }

  return (
    <>
      <Topbar title="Invoices" />
      <PageContainer>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Invoices</h2>
          <p className="text-sm text-muted-foreground">Manage and track vendor payments</p>
        </div>

        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Invoice Number</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="cursor-pointer" onClick={() => setSelectedPoId(invoice.poId)}>
                  <TableCell className="pl-6 font-medium">{invoice.id}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.poId}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.vendor}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatINR(invoice.amount)}
                  </TableCell>
                  <TableCell className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelectedPoId(invoice.poId)}>
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>
    </>
  )
}
