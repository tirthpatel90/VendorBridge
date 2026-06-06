"use client"

import Link from "next/link"
import { FileText, Clock, IndianRupee, Building2, Plus, UserPlus, CheckSquare, ArrowRight, Users, Activity, AlertCircle, TrendingUp, Receipt } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { SpendDonut } from "@/components/charts/spend-donut"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatINR } from "@/lib/data"
import { ClientDate } from "@/components/client-date"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"

export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <>
      <Topbar title="Dashboard" />
      <PageContainer>
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-pretty text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Welcome back, {user.name.split(" ")[0]} — Today&apos;s Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            <ClientDate />
          </p>
        </div>

        {user.role === "admin" && <AdminDashboard />}
        {user.role === "officer" && <OfficerDashboard />}
        {user.role === "vendor" && <VendorDashboard />}
        {user.role === "manager" && <ManagerDashboard />}
      </PageContainer>
    </>
  )
}

function AdminDashboard() {
  const { rfqs } = useStore()
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value="124" icon={Users} accent="primary" />
        <StatCard label="Active Vendors" value="48" icon={Building2} accent="neutral" />
        <StatCard label="System Errors" value="0" icon={AlertCircle} accent="success" />
        <StatCard label="Recent Activities" value="842" icon={Activity} accent="info" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent RFQs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rfqs">
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">RFQ ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.slice(0, 5).map((rfq) => (
                  <TableRow key={rfq.id}>
                     <TableCell className="pl-6 font-medium">{rfq.id}</TableCell>
                     <TableCell className="max-w-[200px] truncate text-muted-foreground">{rfq.title}</TableCell>
                     <TableCell>
                       <StatusBadge status={rfq.status} />
                     </TableCell>
                     <TableCell className="text-muted-foreground">{rfq.deadline}</TableCell>
                     <TableCell className="pr-6 text-right">
                       <Button variant="ghost" size="sm" asChild>
                         <Link href="/quotations">View</Link>
                       </Button>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendDonut />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/rfqs/new">
            <Plus className="size-4" /> New RFQ
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/vendors">
            <UserPlus className="size-4" /> Add Vendor
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/approvals">
            <CheckSquare className="size-4" /> View Approvals
          </Link>
        </Button>
      </div>
    </>
  )
}

function OfficerDashboard() {
  const { rfqs, activeRfqsCount, activeVendorsCount, totalSpend } = useStore()
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active RFQs" value={activeRfqsCount.toString()} icon={FileText} accent="info" trend={{ value: "12%", up: true }} />
        <StatCard label="Pending Approvals" value="6" icon={Clock} accent="warning" trend={{ value: "3%", up: false }} />
        <StatCard
          label="Total Spend This Month"
          value={formatINR(totalSpend)}
          icon={IndianRupee}
          accent="primary"
          trend={{ value: "8%", up: true }}
        />
        <StatCard label="Active Vendors" value={activeVendorsCount.toString()} icon={Building2} accent="neutral" trend={{ value: "5%", up: true }} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent RFQs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rfqs">
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">RFQ ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.slice(0, 5).map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="pl-6 font-medium">{rfq.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{rfq.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={rfq.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{rfq.deadline}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/quotations">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendDonut />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/rfqs/new">
            <Plus className="size-4" /> New RFQ
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/vendors">
            <UserPlus className="size-4" /> Add Vendor
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/approvals">
            <CheckSquare className="size-4" /> View Approvals
          </Link>
        </Button>
      </div>
    </>
  )
}

function VendorDashboard() {
  const { rfqs, purchaseOrders } = useStore()
  const pendingRfqs = rfqs.filter(r => r.status === "Open").length
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending RFQs" value={pendingRfqs.toString()} icon={FileText} accent="warning" />
        <StatCard label="Submitted Quotations" value="12" icon={CheckSquare} accent="info" />
        <StatCard label="Purchase Orders" value={purchaseOrders.length.toString()} icon={Receipt} accent="success" />
        <StatCard label="Invoices Paid" value="6" icon={IndianRupee} accent="primary" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Requests for Quotation</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">You have {pendingRfqs} new requests waiting for your response.</p>
             <Button asChild>
               <Link href="/rfqs">View Pending RFQs</Link>
             </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">You have received {purchaseOrders.length} purchase orders recently.</p>
             <Button variant="outline" asChild>
               <Link href="/purchase-orders">View Purchase Orders</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ManagerDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Approvals" value="5" icon={Clock} accent="warning" />
        <StatCard label="Urgent Requests" value="2" icon={AlertCircle} accent="danger" />
        <StatCard label="Approval Rate" value="94%" icon={TrendingUp} accent="success" />
        <StatCard label="Decisions Made" value="128" icon={CheckSquare} accent="info" />
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Needs Your Attention</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between rounded-lg border p-4">
               <div>
                 <p className="font-medium text-foreground">Office Furniture — Q2 Expansion</p>
                 <p className="text-sm text-muted-foreground">Requires budget approval for {formatINR(185400)}</p>
               </div>
               <Button asChild>
                 <Link href="/approvals">Review Now</Link>
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
