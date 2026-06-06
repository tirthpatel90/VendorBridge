"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Download, Printer, Mail, CheckCircle2, PackageCheck, Eye, ArrowLeft } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatINR } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import { canAccess } from "@/lib/rbac"

export default function PurchaseOrdersPage() {
  const { purchaseOrders } = useStore()
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null)

  if (selectedPoId) {
    return (
      <>
        <Topbar title="Purchase Order Details" />
        <div className="border-b bg-background px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedPoId(null)}>
            <ArrowLeft className="mr-2 size-4" /> Back to List
          </Button>
        </div>
        <PurchaseOrderView poId={selectedPoId} />
      </>
    )
  }

  return (
    <>
      <Topbar title="Purchase Orders" />
      <PageContainer>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Purchase Orders</h2>
          <p className="text-sm text-muted-foreground">Manage and track your purchase orders</p>
        </div>

        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id} className="cursor-pointer" onClick={() => setSelectedPoId(po.id)}>
                  <TableCell className="pl-6 font-medium">{po.id}</TableCell>
                  <TableCell className="text-muted-foreground">{po.vendor}</TableCell>
                  <TableCell className="text-muted-foreground">{po.issueDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={po.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatINR(po.total)}
                  </TableCell>
                  <TableCell className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelectedPoId(po.id)}>
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

export function PurchaseOrderView({ defaultTab = "po", poId }: { defaultTab?: "po" | "invoice"; poId?: string }) {
  const { user } = useAuth()
  const { purchaseOrders, invoices, updateInvoiceStatus } = useStore()
  const perm = canAccess(user?.role, "/purchase-orders")
  const canEdit = perm === "full"

  const po = poId ? purchaseOrders.find((p) => p.id === poId) : purchaseOrders[0]
  const invoice = invoices.find((i) => i.poId === po?.id)
  
  if (!po) return null

  const isPaid = invoice?.status === "Paid"

  return (
    <>
      <Topbar title="Purchase Order & Invoice" />
      <PageContainer>
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="po">Purchase Order</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
          </TabsList>

          {/* Purchase Order */}
          <TabsContent value="po">
            <Card>
              <CardContent className="space-y-6 p-6">
                <DocHeader
                  badge={<StatusBadge status={po.status} />}
                  title="Purchase Order"
                  number={po.id}
                  meta={[
                    { label: "Issue Date", value: po.issueDate },
                    { label: "Due Date", value: po.dueDate },
                  ]}
                />

                <AddressGrid vendorName={po.vendor} />

                <LineTable items={po.items} />

                <Totals subtotal={po.subtotal} tax={po.tax} total={po.total} />

                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end no-print">
                  <Button variant="outline" onClick={() => window.print()}>
                    <Download className="size-4" /> Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="size-4" /> Print
                  </Button>
                  <Button onClick={() => toast.success("PO sent via email")}>
                    <Mail className="size-4" /> Send via Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice */}
          <TabsContent value="invoice">
            <Card>
              <CardContent className="space-y-6 p-6">
                {!invoice ? (
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-medium">
                    No invoice found for this Purchase Order yet.
                  </div>
                ) : (
                  <>
                    {!isPaid && (
                      <div className="flex items-center gap-2 rounded-lg bg-warning/15 px-4 py-3 text-sm font-medium text-warning">
                        <PackageCheck className="size-4" /> Pending Payment — due {invoice.dueDate}
                      </div>
                    )}

                    <DocHeader
                      badge={<StatusBadge status={invoice.status} />}
                      title="Invoice"
                      number={invoice.id}
                      meta={[
                        { label: "Issue Date", value: invoice.issueDate },
                        { label: "Payment Due", value: invoice.dueDate },
                      ]}
                    />

                    <AddressGrid vendorName={po.vendor} />

                    <LineTable items={po.items} />

                    <Totals subtotal={po.subtotal} tax={po.tax} total={po.total} />

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="mb-2 font-medium">Bank Details</p>
                  <div className="grid grid-cols-1 gap-1 text-muted-foreground sm:grid-cols-3">
                    <span>Bank: HDFC Bank</span>
                    <span>A/C: 5012 8843 9921</span>
                    <span>IFSC: HDFC0001234</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end no-print">
                  <Button variant="outline" onClick={() => window.print()}>
                    <Download className="size-4" /> Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="size-4" /> Print
                  </Button>
                  {canEdit && invoice && (
                    <Button
                      disabled={isPaid}
                      onClick={() => {
                        updateInvoiceStatus(invoice.id, "Paid")
                        toast.success("Invoice marked as paid")
                      }}
                    >
                      <CheckCircle2 className="size-4" /> {isPaid ? "Paid" : "Mark as Paid"}
                    </Button>
                  )}
                </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  )
}

function DocHeader({
  badge,
  title,
  number,
  meta,
}: {
  badge: React.ReactNode
  title: string
  number: string
  meta: { label: string; value: string }[]
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          {badge}
        </div>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{number}</p>
      </div>
      <div className="flex gap-6 text-sm">
        {meta.map((m) => (
          <div key={m.label}>
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="font-medium">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddressGrid({ vendorName = "Infra Supplies Co." }: { vendorName?: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Address title="Vendor" lines={[vendorName, "Plot 14, MIDC Area", "Pune, MH 411019", "GST: 27AABCI1234F1Z5"]} />
      <Address title="Billing Address" lines={["VendorBridge Pvt. Ltd.", "8th Floor, Tech Park", "Bengaluru, KA 560103"]} />
      <Address title="Delivery Address" lines={["VendorBridge Warehouse", "Survey 22, Whitefield", "Bengaluru, KA 560066"]} />
    </div>
  )
}

function Address({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {lines.map((l, i) => (
        <p key={i} className={i === 0 ? "text-sm font-medium" : "text-sm text-muted-foreground"}>
          {l}
        </p>
      ))}
    </div>
  )
}

function LineTable({ items }: { items: any[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{formatINR(item.unitPrice)}</TableCell>
              <TableCell className="text-right">{formatINR(item.qty * item.unitPrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function Totals({ subtotal, tax, total }: { subtotal: number; tax: number; total: number }) {
  return (
    <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Sub-total</span>
        <span className="font-medium text-foreground">{formatINR(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>GST (18%)</span>
        <span className="font-medium text-foreground">{formatINR(tax)}</span>
      </div>
      <div className="flex justify-between border-t pt-2 text-base font-semibold">
        <span>Grand Total</span>
        <span className="text-primary">{formatINR(total)}</span>
      </div>
    </div>
  )
}
