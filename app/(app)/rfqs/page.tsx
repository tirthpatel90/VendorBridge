"use client"

import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
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
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"

export default function RfqsPage() {
  const { user } = useAuth()
  const { rfqs } = useStore()
  
  // Mock vendor seeing only a subset
  const filteredRfqs = user?.role === "vendor" ? rfqs.slice(0, 3) : rfqs
  const canCreate = user?.role === "officer"

  return (
    <>
      <Topbar title={user?.role === "vendor" ? "My RFQs" : "RFQs"} />
      <PageContainer>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {user?.role === "vendor" ? "Requests for Quotation" : "Requests for Quotation"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.role === "vendor" ? "Review requests and submit quotes" : "Create and track sourcing requests"}
            </p>
          </div>
          {canCreate && (
            <Button asChild>
              <Link href="/rfqs/new">
                <Plus className="size-4" /> New RFQ
              </Link>
            </Button>
          )}
        </div>

        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">RFQ ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                {user?.role !== "vendor" && <TableHead>Quotes</TableHead>}
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="pl-6 font-medium">{rfq.id}</TableCell>
                  <TableCell className="text-muted-foreground">{rfq.title}</TableCell>
                  <TableCell className="text-muted-foreground">{rfq.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={rfq.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rfq.deadline}</TableCell>
                  {user?.role !== "vendor" && (
                    <TableCell className="text-muted-foreground">{rfq.quotations}</TableCell>
                  )}
                  <TableCell className="pr-6 text-right">
                    {user?.role === "vendor" ? (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/quotations">
                          Submit Quote <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/quotations/compare">
                          Compare <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    )}
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
