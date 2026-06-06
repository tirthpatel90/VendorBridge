"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageContainer } from "@/components/page-container"
import { StatCard } from "@/components/stat-card"
import { MonthlyTrendChart, SpendByCategoryChart } from "@/components/charts/report-charts"
import { topVendors, formatINR } from "@/lib/data"
import { Download, IndianRupee, Receipt, TrendingUp, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { canAccess } from "@/lib/rbac"

export default function ReportsPage() {
  const { user } = useAuth()
  const perm = canAccess(user?.role, "/reports")
  const canExport = perm === "full"

  return (
    <PageContainer>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Procurement performance and spend insights for FY 2025-26.
          </p>
        </div>
        {canExport && (
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export report
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Spend (YTD)"
          value={formatINR(3505000)}
          trend={{ value: "12.4%", up: true }}
          icon={IndianRupee}
        />
        <StatCard label="Invoices Paid" value="126" trend={{ value: "8.1%", up: true }} icon={Receipt} />
        <StatCard label="Avg. Cost Saving" value="9.7%" trend={{ value: "1.3%", up: true }} icon={TrendingUp} />
        <StatCard label="Avg. Vendor Rating" value="4.3" trend={{ value: "0.2", up: true }} icon={Star} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Purchase orders raised vs. invoices paid</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Distribution across procurement categories</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendByCategoryChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Vendors by Spend</CardTitle>
          <CardDescription>Ranked by total purchase order value this fiscal year</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Vendor</TableHead>
                <TableHead>POs</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="pr-6 text-right">Total Spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topVendors.map((v) => (
                <TableRow key={v.name}>
                  <TableCell className="pl-6 font-medium text-foreground">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.pos}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Star className="size-3.5 fill-warning text-warning" />
                      {v.rating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right font-medium text-foreground">
                    {formatINR(v.spend)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
