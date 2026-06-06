"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, Plus, Trash2, UploadCloud, ArrowLeft, ArrowRight, Search } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
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
import { useStore } from "@/lib/store-context"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const steps = ["Basic Info", "Items & Vendors", "Review & Send"]

type Item = { id: number; name: string; qty: string; unit: string; specs: string }

export default function NewRfqPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addRfq, vendors } = useStore()
  const [step, setStep] = useState(0)
  // TODO: we should probably fetch the initial data from an API instead of hardcoding
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", qty: "", unit: "pcs", specs: "" },
  ])
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [vendorQuery, setVendorQuery] = useState("")

  function addItem() {
    setItems((prev) => [...prev, { id: Date.now(), name: "", qty: "", unit: "pcs", specs: "" }])
  }
  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }
  function updateItem(id: number, key: keyof Item, value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)))
  }
  function toggleVendor(id: string) {
    setSelectedVendors((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(vendorQuery.toLowerCase()),
  )

  return (
    <>
      <Topbar title="Create RFQ" />
      <PageContainer>
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex w-full max-w-2xl items-center">
            {steps.map((label, i) => (
              <div key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      i < step && "border-primary bg-primary text-primary-foreground",
                      i === step && "border-primary bg-primary text-primary-foreground",
                      i > step && "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "absolute mt-12 whitespace-nowrap text-xs font-medium",
                      i <= step ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="title">RFQ Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Office Furniture — Q2 Expansion" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                      <SelectItem value="IT Hardware">IT Hardware</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Electrical Equipment">Electrical Equipment</SelectItem>
                      <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the requirement..." rows={4} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full sm:w-56" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Items</h3>
                    <Button variant="outline" size="sm" onClick={addItem}>
                      <Plus className="size-4" /> Add Row
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead className="w-24">Qty</TableHead>
                          <TableHead className="w-28">Unit</TableHead>
                          <TableHead>Specifications</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Item name" className="h-9" />
                            </TableCell>
                            <TableCell>
                              <Input value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} placeholder="0" type="number" className="h-9" />
                            </TableCell>
                            <TableCell>
                              <Input value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className="h-9" />
                            </TableCell>
                            <TableCell>
                              <Input value={item.specs} onChange={(e) => updateItem(item.id, "specs", e.target.value)} placeholder="Specs / notes" className="h-9" />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => removeItem(item.id)} disabled={items.length === 1} aria-label="Remove row">
                                <Trash2 className="size-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold">Select Vendors</h3>
                  <div className="relative mb-3 max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={vendorQuery} onChange={(e) => setVendorQuery(e.target.value)} placeholder="Search vendors..." className="pl-9" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {filteredVendors.map((v) => (
                      <label
                        key={v.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                          selectedVendors.includes(v.id) ? "border-primary bg-accent/50" : "hover:bg-muted",
                        )}
                      >
                        <Checkbox checked={selectedVendors.includes(v.id)} onCheckedChange={() => toggleVendor(v.id)} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{v.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{v.category}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold">Attachments</h3>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary">
                    <UploadCloud className="size-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag and drop files here</p>
                    <p className="text-xs text-muted-foreground">or click to browse (PDF, XLSX, up to 10MB)</p>
                    <input type="file" multiple className="sr-only" />
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold">Review your RFQ</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Summary label="Title" value={title || "—"} />
                  <Summary label="Category" value={category || "—"} />
                  <Summary label="Deadline" value={deadline || "—"} />
                  <Summary label="Vendors Selected" value={`${selectedVendors.length} vendor(s)`} />
                </div>
                <Summary label="Description" value={description || "—"} />
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Items ({items.length})</p>
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Specs</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((i) => (
                          <TableRow key={i.id}>
                            <TableCell>{i.name || "—"}</TableCell>
                            <TableCell>{i.qty || "—"}</TableCell>
                            <TableCell>{i.unit}</TableCell>
                            <TableCell className="text-muted-foreground">{i.specs || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="size-4" /> Back
              </Button>

              {step < 2 ? (
                <Button onClick={() => setStep((s) => s + 1)}>
                  Next <ArrowRight className="size-4" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.success("RFQ saved as draft")
                      router.push("/rfqs")
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!title || !category || !deadline) {
                        toast.error("Please fill in Title, Category and Deadline")
                        return
                      }
                      await addRfq({
                        title,
                        category,
                        deadline,
                        createdBy: user?.name || "System",
                      })
                      toast.success(`RFQ sent to ${selectedVendors.length} vendor(s)`)
                      router.push("/rfqs")
                    }}
                  >
                    Save &amp; Send to Vendors
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  )
}
