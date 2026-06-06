"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, X, FileText, Download } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { StatusBadge } from "@/components/status-badge"
import { ClientDate } from "@/components/client-date"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { poLineItems, approvalTimeline, formatINR } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import { canAccess } from "@/lib/rbac"

const flow = ["Submitted", "Under Review", "Approved", "PO Generated"]

export default function ApprovalsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addPO, addActivity } = useStore()
  const perm = canAccess(user?.role, "/approvals")
  const canApprove = perm === "full"
  
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending")
  const currentStep = decision === "pending" ? 1 : decision === "approved" ? 2 : 1

  const subtotal = poLineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  return (
    <>
      <Topbar title="Approval Workflow" />
      <PageContainer>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Office Furniture — Q2 Expansion
            </h2>
            <p className="text-sm text-muted-foreground">Vendor: Infra Supplies Co.</p>
          </div>
          <div className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            {formatINR(total)}
          </div>
        </div>

        {/* Step progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center">
              {flow.map((label, i) => {
                const done = i < currentStep || (decision === "approved" && i <= 3)
                const active = i === currentStep && decision === "pending"
                const rejected = decision === "rejected" && i === 2
                return (
                  <div key={label} className={cn("flex items-center", i < flow.length - 1 && "flex-1")}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold",
                          rejected && "border-destructive bg-destructive text-white",
                          !rejected && (done || active) && "border-primary bg-primary text-primary-foreground",
                          !rejected && !done && !active && "border-border bg-card text-muted-foreground",
                        )}
                      >
                        {rejected ? <X className="size-4" /> : done ? <Check className="size-4" /> : i + 1}
                      </div>
                      <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                        {rejected && i === 2 ? "Rejected" : label}
                      </span>
                    </div>
                    {i < flow.length - 1 && (
                      <div className={cn("mx-2 h-0.5 flex-1", i < currentStep ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Procurement summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Procurement Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    {poLineItems.map((item) => (
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
              <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label="GST (18%)" value={formatINR(tax)} />
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Grand Total</span>
                  <span className="text-primary">{formatINR(total)}</span>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-sm">
                <span className="text-muted-foreground">Payment Terms: </span>
                <span className="font-medium">Net 30 Days</span>
              </div>
            </CardContent>
          </Card>

          {/* Approval panel */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">NG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Neha Gupta</p>
                  <p className="text-xs text-muted-foreground">Procurement Manager</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Reviewed on <ClientDate options={{ year: "numeric", month: "short", day: "numeric" }} />
              </p>

              {decision !== "pending" && (
                <StatusBadge status={decision === "approved" ? "Approved" : "Rejected"} />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" placeholder="Add your remarks..." rows={3} disabled={!canApprove} />
              </div>

              {canApprove && decision === "pending" && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setDecision("approved")
                      addPO({
                        vendor: "Infra Supplies Co.",
                        issueDate: new Date().toISOString().split("T")[0],
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                        status: "Approved",
                        subtotal,
                        tax,
                        total,
                        items: poLineItems,
                      })
                      addActivity({
                        type: "Approvals",
                        tone: "success",
                        user: user?.name || "System",
                        initials: user?.initials || "SY",
                        description: "Approval granted — Infra Supplies Co. ₹185,400",
                      })
                      toast.success("Procurement approved & PO Generated")
                    }}
                  >
                    <Check className="size-4" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDecision("rejected")
                      toast.error("Procurement rejected")
                    }}
                  >
                    <X className="size-4" /> Reject
                  </Button>
                </div>
              )}

              {decision === "approved" && (
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      toast.info("Redirecting to Purchase Order...")
                      router.push("/purchase-orders")
                    }}
                  >
                    <FileText className="mr-2 size-4" /> View Purchase Order
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full no-print"
                    onClick={() => {
                      toast.success("Redirecting to Purchase Order for PDF download")
                      router.push("/purchase-orders")
                    }}
                  >
                    <Download className="mr-2 size-4" /> Download PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Approval Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-5">
              {approvalTimeline.map((entry, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-muted text-xs font-semibold">{entry.initials}</AvatarFallback>
                    </Avatar>
                    {i < approvalTimeline.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-foreground">{entry.user}</p>
                    <p className="text-sm text-muted-foreground">{entry.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
