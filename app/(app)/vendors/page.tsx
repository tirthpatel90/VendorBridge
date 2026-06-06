"use client"

import { useState } from "react"
import { Search, Plus, Eye, Pencil, Power, Star, Mail, Phone, MapPin, Building2, CreditCard } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatINR, type Vendor } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import { canAccess } from "@/lib/rbac"
import { toast } from "sonner"

const filters = ["All", "Active", "Inactive", "Pending"] as const

export default function VendorsPage() {
  const { user } = useAuth()
  const { vendors, addVendor } = useStore()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [selected, setSelected] = useState<Vendor | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const perm = canAccess(user?.role, "/vendors")
  const canEdit = perm === "full"

  const filtered = vendors.filter((v) => {
    const matchesQuery =
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.category.toLowerCase().includes(query.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === "All" || v.status === filter
    return matchesQuery && matchesFilter
  })

  return (
    <>
      <Topbar title="Vendors" />
      <PageContainer>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Vendors</h2>
          <p className="text-sm text-muted-foreground">Manage supplier profiles and registrations</p>
        </div>

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
            {canEdit && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="size-4" /> Add Vendor
              </Button>
            )}
          </div>
        </div>

        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Vendor Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(vendor)}
                >
                  <TableCell className="pl-6 font-medium">{vendor.name}</TableCell>
                  <TableCell className="text-muted-foreground">{vendor.category}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{vendor.gst}</TableCell>
                  <TableCell className="text-muted-foreground">{vendor.contactPerson}</TableCell>
                  <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={vendor.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelected(vendor)} aria-label="View">
                        <Eye className="size-4" />
                      </Button>
                      {canEdit && (
                        <>
                          <Button variant="ghost" size="icon" className="size-8" aria-label="Edit">
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 text-destructive" aria-label="Deactivate">
                            <Power className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No vendors match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>

      <VendorPanel vendor={selected} onClose={() => setSelected(null)} canEdit={canEdit} />
      
      <AddVendorSheet 
        open={showAddForm} 
        onClose={() => setShowAddForm(false)} 
        onAdd={(vendor) => {
          addVendor(vendor)
          toast.success("Vendor added successfully")
          setShowAddForm(false)
        }} 
      />
    </>
  )
}

function AddVendorSheet({ open, onClose, onAdd }: { open: boolean, onClose: () => void, onAdd: (v: any) => void }) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [gst, setGst] = useState("")
  const [address, setAddress] = useState("")
  
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Vendor</SheetTitle>
          <SheetDescription>Enter vendor details below to register a new supplier.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Corp" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. IT Hardware" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@acme.com" type="email" />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91..." />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Person</Label>
            <Input value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Name of contact" />
          </div>
          <div className="space-y-1.5">
            <Label>GST Number</Label>
            <Input value={gst} onChange={e => setGst(e.target.value)} placeholder="22AAAAA0000A1Z5" />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Company Address" />
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={async () => {
            if (!name || !email || !category) {
              toast.error("Please fill in Name, Email and Category")
              return
            }
            await onAdd({ name, category, email, phone, contactPerson, gst, address, bank: { name: "N/A", account: "N/A", ifsc: "N/A" } })
            toast.success(`${name} added successfully!`)
            setName("")
            setCategory("")
            setEmail("")
            setPhone("")
            setContactPerson("")
            setGst("")
            setAddress("")
            onClose()
          }}>
            Save Vendor
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function VendorPanel({ vendor, onClose, canEdit }: { vendor: Vendor | null; onClose: () => void; canEdit: boolean }) {
  return (
    <Sheet open={!!vendor} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {vendor && (
          <>
            <SheetHeader>
              <div className="flex items-center justify-between gap-3">
                <SheetTitle className="text-lg">{vendor.name}</SheetTitle>
                <StatusBadge status={vendor.status} />
              </div>
              <SheetDescription>
                {vendor.id} · {vendor.category}
              </SheetDescription>
              <div className="mt-1 flex items-center gap-1 text-sm text-warning">
                <Star className="size-4 fill-current" />
                <span className="font-medium text-foreground">{vendor.rating}</span>
                <span className="text-muted-foreground">vendor rating</span>
              </div>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              <Section title="Contact Details" icon={Building2}>
                <Detail icon={Mail} label="Email" value={vendor.email} />
                <Detail icon={Phone} label="Phone" value={vendor.phone} />
                <Detail icon={MapPin} label="Address" value={vendor.address} />
                <Detail label="Contact Person" value={vendor.contactPerson} />
              </Section>

              <Section title="GST Information">
                <Detail label="GST Number" value={vendor.gst} mono />
              </Section>

              <Section title="Bank Details" icon={CreditCard}>
                <Detail label="Bank" value={vendor.bank.name} />
                <Detail label="Account" value={vendor.bank.account} mono />
                <Detail label="IFSC" value={vendor.bank.ifsc} mono />
              </Section>

              <Section title="Past Purchase Orders">
                {vendor.pos.length > 0 ? (
                  <div className="space-y-2">
                    {vendor.pos.map((po) => (
                      <div key={po.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                        <div>
                          <p className="font-medium">{po.id}</p>
                          <p className="text-xs text-muted-foreground">{po.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatINR(po.amount)}</p>
                          <StatusBadge status={po.status} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
                )}
              </Section>

              <Separator />

              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div>
                  <p className="text-sm font-medium">Vendor Status</p>
                  <p className="text-xs text-muted-foreground">
                    {canEdit ? "Toggle active state" : "Current state"}
                  </p>
                </div>
                {canEdit ? (
                  <StatusToggle initial={vendor.status === "Active"} />
                ) : (
                  <StatusBadge status={vendor.status} />
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function StatusToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className={cn("text-foreground", mono && "font-mono text-xs")}>{value}</span>
    </div>
  )
}
