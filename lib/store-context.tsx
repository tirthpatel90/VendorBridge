"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import {
  comparisonQuotes,
  type Rfq,
  type Vendor,
  type Activity,
  type PurchaseOrder,
  type Invoice,
  type Quotation,
} from "./data"

// Helper to generate short IDs for optimistic updates
function tmpId() {
  return `tmp-${Math.random().toString(36).slice(2)}`
}

// Helper: format a Mongo doc to match the local type shape
function normalizeId<T extends { _id?: string; id?: string }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id || doc.id || tmpId() }
}

type StoreContextType = {
  rfqs: Rfq[]
  addRfq: (rfq: Omit<Rfq, "id" | "status" | "quotations">) => Promise<void>
  vendors: Vendor[]
  addVendor: (vendor: Omit<Vendor, "id" | "status" | "rating" | "pos">) => Promise<void>
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "time">) => Promise<void>
  purchaseOrders: PurchaseOrder[]
  addPO: (po: Omit<PurchaseOrder, "id">) => Promise<void>
  invoices: Invoice[]
  addInvoice: (invoice: Omit<Invoice, "id">) => Promise<void>
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => Promise<void>
  activeRfqsCount: number
  totalSpend: number
  activeVendorsCount: number
  quotations: Quotation[]
  addQuotation: (quotation: Quotation) => Promise<void>
  isLoading: boolean
  refreshAll: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [rfqs, setRfqs] = useState<Rfq[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [purchaseOrders, setPOs] = useState<PurchaseOrder[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>(comparisonQuotes) // seed from static until DB has data
  const [isLoading, setIsLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const [rfqRes, vendorRes, activityRes, poRes, invoiceRes, quotationRes] = await Promise.all([
        fetch("/api/rfqs"),
        fetch("/api/vendors"),
        fetch("/api/activities"),
        fetch("/api/purchase-orders"),
        fetch("/api/invoices"),
        fetch("/api/quotations"),
      ])

      if (rfqRes.ok) {
        const data = await rfqRes.json()
        const mapped: Rfq[] = data.map((d: any) => ({
          id: d._id,
          title: d.title,
          category: d.category,
          status: d.status,
          deadline: d.deadline,
          quotations: d.quotations,
          createdBy: d.createdBy,
        }))
        setRfqs(mapped)
      }

      if (vendorRes.ok) {
        const data = await vendorRes.json()
        const mapped: Vendor[] = data.map((d: any) => ({
          id: d._id,
          name: d.name,
          category: d.category,
          gst: d.gst || "",
          contactPerson: d.contactPerson || "",
          email: d.email,
          phone: d.phone || "",
          address: d.address || "",
          status: d.status,
          rating: d.rating,
          bank: d.bank || { name: "N/A", account: "N/A", ifsc: "N/A" },
          pos: d.pos || [],
        }))
        setVendors(mapped)
      }

      if (activityRes.ok) {
        const data = await activityRes.json()
        const mapped: Activity[] = data.map((d: any) => ({
          id: d._id,
          type: d.type,
          tone: d.tone,
          time: new Date(d.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }),
          user: d.user,
          initials: d.initials,
          description: d.description,
        }))
        setActivities(mapped)
      }

      if (poRes.ok) {
        const data = await poRes.json()
        const mapped: PurchaseOrder[] = data.map((d: any) => ({
          id: d._id,
          vendor: d.vendor,
          issueDate: d.issueDate,
          dueDate: d.dueDate,
          status: d.status,
          subtotal: d.subtotal,
          tax: d.tax,
          total: d.total,
          items: d.items || [],
        }))
        setPOs(mapped)
      }

      if (invoiceRes.ok) {
        const data = await invoiceRes.json()
        const mapped: Invoice[] = data.map((d: any) => ({
          id: d._id,
          poId: d.poId,
          vendor: d.vendor,
          issueDate: d.issueDate,
          dueDate: d.dueDate,
          status: d.status,
          amount: d.amount,
        }))
        setInvoices(mapped)
      }

      if (quotationRes.ok) {
        const data = await quotationRes.json()
        if (data.length > 0) {
          const mapped: Quotation[] = data.map((d: any) => ({
            vendor: d.vendor,
            rating: d.rating,
            delivery: d.delivery,
            unitPrices: d.unitPrices,
            total: d.total,
          }))
          setQuotations(mapped)
        }
        // else keep the static seed data as default
      }
    } catch (err) {
      console.error("Failed to fetch store data", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ── Helpers ──────────────────────────────────────────────────

  async function addActivity(activity: Omit<Activity, "id" | "time">) {
    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      })
      // Optimistic update
      setActivities((prev) => [{
        ...activity,
        id: tmpId(),
        time: "Just now",
      }, ...prev])
    } catch (err) {
      console.error("Failed to add activity", err)
    }
  }

  // ── RFQ ──────────────────────────────────────────────────────

  async function addRfq(rfq: Omit<Rfq, "id" | "status" | "quotations">) {
    const res = await fetch("/api/rfqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rfq, status: "Open", quotations: 0 }),
    })
    if (res.ok) {
      const created = await res.json()
      const newRfq: Rfq = {
        id: created._id,
        title: created.title,
        category: created.category,
        status: created.status,
        deadline: created.deadline,
        quotations: created.quotations,
        createdBy: created.createdBy,
      }
      setRfqs((prev) => [newRfq, ...prev])
      await addActivity({
        type: "RFQs",
        tone: "success",
        user: rfq.createdBy,
        initials: rfq.createdBy.split(" ").map((n) => n[0]).join(""),
        description: `RFQ created — ${rfq.title}`,
      })
    }
  }

  // ── Vendor ───────────────────────────────────────────────────

  async function addVendor(vendor: Omit<Vendor, "id" | "status" | "rating" | "pos">) {
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendor),
    })
    if (res.ok) {
      const created = await res.json()
      const newVendor: Vendor = {
        id: created._id,
        name: created.name,
        category: created.category,
        gst: created.gst || "",
        contactPerson: created.contactPerson || "",
        email: created.email,
        phone: created.phone || "",
        address: created.address || "",
        status: "Pending",
        rating: 0,
        bank: created.bank || { name: "N/A", account: "N/A", ifsc: "N/A" },
        pos: [],
      }
      setVendors((prev) => [newVendor, ...prev])
      await addActivity({
        type: "Vendors",
        tone: "info",
        user: "System",
        initials: "SY",
        description: `New vendor registered — ${vendor.name}`,
      })
    }
  }

  // ── PO ───────────────────────────────────────────────────────

  async function addPO(po: Omit<PurchaseOrder, "id">) {
    const res = await fetch("/api/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(po),
    })
    if (res.ok) {
      const created = await res.json()
      const newPO: PurchaseOrder = { ...po, id: created._id }
      setPOs((prev) => [newPO, ...prev])
    }
  }

  // ── Invoice ──────────────────────────────────────────────────

  async function addInvoice(invoice: Omit<Invoice, "id">) {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoice),
    })
    if (res.ok) {
      const created = await res.json()
      const newInvoice: Invoice = { ...invoice, id: created._id }
      setInvoices((prev) => [newInvoice, ...prev])
    }
  }

  async function updateInvoiceStatus(id: string, status: Invoice["status"]) {
    // Optimistic
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    try {
      await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
    } catch (err) {
      console.error("Failed to update invoice status", err)
    }
  }

  // ── Quotation ────────────────────────────────────────────────

  async function addQuotation(quotation: Quotation) {
    const res = await fetch("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotation),
    })
    if (res.ok) {
      setQuotations((prev) => [...prev, quotation])
      await addActivity({
        type: "Quotations",
        tone: "info",
        user: quotation.vendor,
        initials: quotation.vendor.substring(0, 2).toUpperCase(),
        description: `New quotation submitted by ${quotation.vendor}`,
      })
    }
  }

  // ── Derived stats ─────────────────────────────────────────────
  const activeRfqsCount = rfqs.filter((r) => r.status === "Open").length
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.total, 0)
  const activeVendorsCount = vendors.filter((v) => v.status === "Active").length

  return (
    <StoreContext.Provider
      value={{
        rfqs,
        addRfq,
        vendors,
        addVendor,
        activities,
        addActivity,
        purchaseOrders,
        addPO,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        activeRfqsCount,
        totalSpend,
        activeVendorsCount,
        quotations,
        addQuotation,
        isLoading,
        refreshAll: fetchAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
