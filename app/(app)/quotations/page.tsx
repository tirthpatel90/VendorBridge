"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { FileText, Calendar, User, ArrowRight, Star } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { comparisonItems, formatINR } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"

export default function QuotationsPage() {
  const { user } = useAuth()
  const { quotations, addQuotation } = useStore()

  // Vendors see the submission form; everyone else sees the list of received quotations
  if (user?.role === "vendor") {
    return <VendorSubmitForm userName={user.name} addQuotation={addQuotation} />
  }

  return <ProcurementQuotationsList quotations={quotations} />
}

/* ─── Procurement / Officer / Admin view: list of received quotations ─── */
function ProcurementQuotationsList({ quotations }: { quotations: ReturnType<typeof useStore>["quotations"] }) {
  return (
    <>
      <Topbar title="Quotations Received" />
      <PageContainer>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Quotations Received
            </h2>
            <p className="text-sm text-muted-foreground">
              {quotations.length} quotation{quotations.length !== 1 ? "s" : ""} received for RFQ-2025-088
            </p>
          </div>
          <Button asChild>
            <Link href="/quotations/compare">
              Compare All <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">#</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((q, idx) => {
                const totalWithTax = Math.round(q.total * 1.18)
                return (
                  <TableRow key={idx}>
                    <TableCell className="pl-6 text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-foreground">{q.vendor}</TableCell>
                    <TableCell className="font-semibold text-primary">{formatINR(totalWithTax)}</TableCell>
                    <TableCell className="text-muted-foreground">{q.delivery}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5 fill-warning text-warning" />
                        <span className="font-medium">{q.rating}</span>
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/quotations/compare">
                          Compare <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {quotations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No quotations received yet. Vendors will submit their bids here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>
    </>
  )
}

/* ─── Vendor view: quotation submission form ─── */
function VendorSubmitForm({
  userName,
  addQuotation,
}: {
  userName: string
  addQuotation: ReturnType<typeof useStore>["addQuotation"]
}) {
  const [prices, setPrices] = useState<Record<number, string>>({})
  const [status, setStatus] = useState("Draft")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")

  const lineTotal = (i: number) => Number(prices[i] || 0) * comparisonItems[i].qty
  const grandTotal = comparisonItems.reduce((s, _, i) => s + lineTotal(i), 0)

  const handleSubmit = () => {
    if (grandTotal === 0) {
      toast.error("Please enter prices before submitting")
      return
    }

    const unitPricesArray = comparisonItems.map((_, i) => Number(prices[i] || 0))
    addQuotation({
      vendor: userName,
      rating: 4.5,
      delivery: deliveryDate || "TBD",
      unitPrices: unitPricesArray,
      total: grandTotal,
    })
    setStatus("Submitted")
    toast.success("Quotation submitted successfully! Procurement team can now see your bid.")
  }

  return (
    <>
      <Topbar title="Submit Quotation" />
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Quotation Submission</h2>
            <p className="text-sm text-muted-foreground">Respond to RFQ-2025-088</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* RFQ Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" /> RFQ Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Office Furniture — Q2 Expansion</p>
                <p className="text-xs text-muted-foreground">RFQ-2025-088</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" /> Deadline: 2025-06-18
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" /> Requester: Aarav Mehta
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quotation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Quotation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-40">Unit Price (₹)</TableHead>
                    <TableHead className="w-20">Qty</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonItems.map((item, i) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={prices[i] || ""}
                          onChange={(e) => setPrices((p) => ({ ...p, [i]: e.target.value }))}
                          placeholder="0"
                          className="h-9"
                          disabled={status === "Submitted"}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.qty}</TableCell>
                      <TableCell className="text-right font-medium">{formatINR(lineTotal(i))}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-semibold">Grand Total</TableCell>
                    <TableCell className="text-right text-base font-semibold text-primary">{formatINR(grandTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="delivery">Delivery Timeline</Label>
                <Input
                  id="delivery"
                  type="date"
                  className="w-full"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  disabled={status === "Submitted"}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="terms">Payment Terms</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms} disabled={status === "Submitted"}>
                  <SelectTrigger id="terms" className="w-full">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advance">100% Advance</SelectItem>
                    <SelectItem value="net15">Net 15 Days</SelectItem>
                    <SelectItem value="net30">Net 30 Days</SelectItem>
                    <SelectItem value="milestone">Milestone-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Any additional terms or remarks..." rows={3} disabled={status === "Submitted"} />
            </div>

            {status !== "Submitted" && (
              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("Draft")
                    toast.success("Quotation saved as draft")
                  }}
                >
                  Save Draft
                </Button>
                <Button onClick={handleSubmit}>
                  Submit Quotation
                </Button>
              </div>
            )}

            {status === "Submitted" && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm font-medium text-primary">
                ✅ Quotation submitted! The procurement team will compare your bid.
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </>
  )
}
