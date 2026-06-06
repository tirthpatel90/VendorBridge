"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Star, Check } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { comparisonItems, formatINR } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import { canAccess } from "@/lib/rbac"

type SortKey = "price" | "delivery" | "rating"

export default function ComparePage() {
  const { user } = useAuth()
  const { quotations } = useStore()
  const perm = canAccess(user?.role, "/quotations/compare")
  const canApprove = perm === "full"

  const [sort, setSort] = useState<SortKey>("price")

  const quotes = [...quotations].sort((a, b) => {
    if (sort === "price") return a.total - b.total
    if (sort === "delivery") return a.delivery.localeCompare(b.delivery)
    return b.rating - a.rating
  })

  // Per line item, find lowest and second-lowest price across vendors
  function priceRank(itemIndex: number, vendorIndex: number) {
    const prices = quotes.map((q) => q.unitPrices[itemIndex])
    const sorted = [...prices].sort((a, b) => a - b)
    const price = quotes[vendorIndex].unitPrices[itemIndex]
    if (price === sorted[0]) return "lowest"
    if (price === sorted[1]) return "second"
    return "none"
  }

  const totals = quotes.map((q) => q.total)
  const lowestTotal = Math.min(...totals)

  const cellTone = (rank: string) =>
    rank === "lowest"
      ? "bg-primary/15 font-semibold text-foreground"
      : rank === "second"
        ? "bg-accent/50"
        : ""

  return (
    <>
      <Topbar title="Compare Quotations" />
      <PageContainer>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Office Furniture — Q2 Expansion
            </h2>
            <p className="text-sm text-muted-foreground">{quotes.length} quotation{quotes.length !== 1 ? "s" : ""} received · RFQ-2025-088</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/quotations">← All Quotations</Link>
            </Button>
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Total Price</SelectItem>
                <SelectItem value="delivery">Delivery Date</SelectItem>
                <SelectItem value="rating">Vendor Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="overflow-x-auto py-0">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="sticky left-0 z-10 bg-card p-4 text-left font-medium text-muted-foreground">
                  Line Item
                </th>
                {quotes.map((q) => {
                  const isWinner = q.total === lowestTotal
                  return (
                    <th key={q.vendor} className="min-w-[180px] p-4 text-left align-top">
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">{q.vendor}</p>
                        {isWinner && canApprove && (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => toast.success(`${q.vendor} selected and approved`)}
                          >
                            <Check className="size-4" /> Select &amp; Approve
                          </Button>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonItems.map((item, itemIndex) => (
                <tr key={item.name} className="border-b">
                  <td className="sticky left-0 z-10 bg-card p-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.qty} {item.unit}
                    </p>
                  </td>
                  {quotes.map((q, vendorIndex) => {
                    const rank = priceRank(itemIndex, vendorIndex)
                    return (
                      <td key={q.vendor} className={cn("p-4", cellTone(rank))}>
                        {formatINR(q.unitPrices[itemIndex] * item.qty)}
                        <span className="block text-xs text-muted-foreground">
                          {formatINR(q.unitPrices[itemIndex])}/unit
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}

              <SummaryRow label="Subtotal" values={quotes.map((q) => q.total)} lowest={lowestTotal} />
              <SummaryRow
                label="Tax (18% GST)"
                values={quotes.map((q) => Math.round(q.total * 0.18))}
                muted
              />
              <tr className="border-b bg-muted/50">
                <td className="sticky left-0 z-10 bg-muted/50 p-4 font-semibold">Total</td>
                {quotes.map((q) => (
                  <td
                    key={q.vendor}
                    className={cn(
                      "p-4 font-semibold",
                      q.total === lowestTotal ? "bg-primary/15 text-primary" : "",
                    )}
                  >
                    {formatINR(Math.round(q.total * 1.18))}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-card p-4 text-muted-foreground">Delivery Date</td>
                {quotes.map((q) => (
                  <td key={q.vendor} className="p-4 text-muted-foreground">
                    {q.delivery}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 bg-card p-4 text-muted-foreground">Vendor Rating</td>
                {quotes.map((q) => (
                  <td key={q.vendor} className="p-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{q.rating}</span>
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Card>
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="mr-1 inline-block size-2.5 rounded-sm bg-primary/40 align-middle" /> Lowest price
          <span className="ml-4 mr-1 inline-block size-2.5 rounded-sm bg-accent align-middle" /> Second lowest
        </p>
      </PageContainer>
    </>
  )
}

function SummaryRow({
  label,
  values,
  lowest,
  muted,
}: {
  label: string
  values: number[]
  lowest?: number
  muted?: boolean
}) {
  return (
    <tr className="border-b">
      <td className={cn("sticky left-0 z-10 bg-card p-4", muted ? "text-muted-foreground" : "font-medium")}>
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn("p-4", muted ? "text-muted-foreground" : "font-medium", lowest && v === lowest ? "bg-primary/15 text-primary" : "")}
        >
          {formatINR(v)}
        </td>
      ))}
    </tr>
  )
}
