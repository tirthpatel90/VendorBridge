import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/lib/models/user"
import RfqModel from "@/lib/models/rfq"
import VendorModel from "@/lib/models/vendor"
import ActivityModel from "@/lib/models/activity"
import PurchaseOrderModel from "@/lib/models/purchaseOrder"
import InvoiceModel from "@/lib/models/invoice"
import QuotationModel from "@/lib/models/quotation"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    await connectDB()

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash("password123", salt)

    // ── Users ────────────────────────────────────────────────────
    await User.deleteMany({})
    await User.insertMany([
      { firstName: "Aditi", lastName: "Sharma", email: "aditi.admin@vendorbridge.io", password, role: "admin", phone: "+91 98765 43210", country: "India", info: "System Administrator" },
      { firstName: "Aarav", lastName: "Mehta", email: "aarav.mehta@vendorbridge.io", password, role: "officer", phone: "+91 98200 11223", country: "India", info: "Procurement Officer" },
      { firstName: "Rajesh", lastName: "Kumar", email: "rajesh@infrasupplies.in", password, role: "vendor", phone: "+91 91234 56789", country: "India", info: "Infra Supplies Co." },
      { firstName: "Neha", lastName: "Gupta", email: "neha.gupta@vendorbridge.io", password, role: "manager", phone: "+91 99887 76655", country: "India", info: "Procurement Manager" },
      { firstName: "Vikram", lastName: "Singh", email: "vikram@techbuild.in", password, role: "vendor", phone: "+91 98765 12345", country: "India", info: "TechBuild Constructions" },
      { firstName: "Priya", lastName: "Desai", email: "priya.desai@vendorbridge.io", password, role: "officer", phone: "+91 91122 33445", country: "India", info: "Junior Procurement Officer" },
    ])

    // ── Vendors ──────────────────────────────────────────────────
    await VendorModel.deleteMany({})
    await VendorModel.insertMany([
      { name: "Infra Supplies Co.", category: "Construction Materials", gst: "27AABCI1234F1Z5", contactPerson: "Rajesh Kumar", email: "rajesh@infrasupplies.in", phone: "+91 98200 11223", status: "Active", rating: 4.6, bank: { name: "HDFC Bank", account: "5012 8843 9921", ifsc: "HDFC0001234" }, address: "Plot 14, MIDC Industrial Area, Pune, MH 411019", pos: [{ id: "PO-2025-0066", date: "2025-05-12", amount: 185400, status: "Paid" }] },
      { name: "OfficePro Furnishings", category: "Office Furniture", gst: "29AAACO5678H1Z2", contactPerson: "Sneha Iyer", email: "sneha@officepro.com", phone: "+91 99453 88210", status: "Active", rating: 4.2, bank: { name: "ICICI Bank", account: "6233 1190 4456", ifsc: "ICIC0004412" }, address: "22 Brigade Road, Bengaluru, KA 560001", pos: [] },
      { name: "TechNova Systems", category: "IT Hardware", gst: "07AAACT9087K1Z9", contactPerson: "Vikram Anand", email: "vikram@technova.io", phone: "+91 91670 45582", status: "Pending", rating: 3.9, bank: { name: "Axis Bank", account: "9087 2234 1100", ifsc: "UTIB0000456" }, address: "Tower B, Cyber Hub, Gurugram, HR 122002", pos: [] },
      { name: "GreenLeaf Stationery", category: "Office Supplies", gst: "33AAGCG2211L1Z0", contactPerson: "Priya Nair", email: "priya@greenleaf.in", phone: "+91 97890 22117", status: "Active", rating: 4.4, bank: { name: "SBI", account: "3344 7788 1290", ifsc: "SBIN0007781" }, address: "5 Anna Salai, Chennai, TN 600002", pos: [] },
      { name: "SafeGuard Industrial", category: "Safety Equipment", gst: "19AAJCS6677N1Z4", contactPerson: "Anita Das", email: "anita@safeguard.co.in", phone: "+91 98300 77665", status: "Active", rating: 4.1, bank: { name: "Yes Bank", account: "7788 1234 5566", ifsc: "YESB0000334" }, address: "44 Park Street, Kolkata, WB 700016", pos: [] },
    ])

    // ── RFQs ─────────────────────────────────────────────────────
    await RfqModel.deleteMany({})
    await RfqModel.insertMany([
      { title: "Office Furniture — Q2 Expansion", category: "Office Furniture", status: "Open", deadline: "2025-06-18", quotations: 3, createdBy: "Aarav Mehta" },
      { title: "Server Room IT Hardware Upgrade", category: "IT Hardware", status: "Open", deadline: "2025-06-22", quotations: 2, createdBy: "Aarav Mehta" },
      { title: "Annual Stationery Supply", category: "Office Supplies", status: "Awarded", deadline: "2025-06-05", quotations: 5, createdBy: "Neha Gupta" },
      { title: "Electrical Panel Maintenance Kit", category: "Electrical Equipment", status: "Closed", deadline: "2025-05-28", quotations: 2, createdBy: "Aarav Mehta" },
      { title: "Site Safety Gear Procurement", category: "Safety Equipment", status: "Draft", deadline: "2025-06-30", quotations: 0, createdBy: "Aarav Mehta" },
    ])

    // ── Purchase Orders ───────────────────────────────────────────
    await PurchaseOrderModel.deleteMany({})
    await PurchaseOrderModel.insertMany([
      {
        vendor: "Infra Supplies Co.", issueDate: "2025-06-04", dueDate: "2025-07-04", status: "Approved",
        subtotal: 1043500, tax: 187830, total: 1231330,
        items: [
          { name: "Ergonomic Office Chair", qty: 40, unitPrice: 8200 },
          { name: "Height-Adjustable Desk", qty: 40, unitPrice: 14800 },
          { name: "Steel Filing Cabinet", qty: 15, unitPrice: 6100 },
          { name: "Conference Table (8-seater)", qty: 3, unitPrice: 41000 },
        ],
      },
      {
        vendor: "OfficePro Furnishings", issueDate: "2025-06-01", dueDate: "2025-06-30", status: "Delivered",
        subtotal: 450000, tax: 81000, total: 531000,
        items: [{ name: "Executive Desk", qty: 10, unitPrice: 25000 }, { name: "Mesh Chair", qty: 20, unitPrice: 10000 }],
      },
      {
        vendor: "GreenLeaf Stationery", issueDate: "2025-05-28", dueDate: "2025-06-28", status: "Paid",
        subtotal: 24372, tax: 4388, total: 28760,
        items: [{ name: "A4 Paper Ream", qty: 100, unitPrice: 200 }, { name: "Notebooks", qty: 50, unitPrice: 87 }],
      },
    ])

    // ── Invoices ──────────────────────────────────────────────────
    await InvoiceModel.deleteMany({})
    await InvoiceModel.insertMany([
      { poId: "PO-2025-0065", vendor: "OfficePro Furnishings", issueDate: "2025-06-06", dueDate: "2025-07-04", status: "Pending Payment", amount: 531000 },
      { poId: "PO-2025-0064", vendor: "GreenLeaf Stationery", issueDate: "2025-05-30", dueDate: "2025-06-15", status: "Paid", amount: 28760 },
      { poId: "PO-2025-0059", vendor: "OfficePro Furnishings", issueDate: "2025-05-01", dueDate: "2025-05-30", status: "Overdue", amount: 134900 },
    ])

    // ── Quotations ────────────────────────────────────────────────
    await QuotationModel.deleteMany({})
    await QuotationModel.insertMany([
      { rfqId: "RFQ-2025-088", vendor: "OfficePro Furnishings", rating: 4.2, delivery: "2025-07-05", unitPrices: [8500, 14200, 6400, 38500], total: 8500 * 40 + 14200 * 40 + 6400 * 15 + 38500 * 3 },
      { rfqId: "RFQ-2025-088", vendor: "Infra Supplies Co.", rating: 4.6, delivery: "2025-07-12", unitPrices: [8200, 14800, 6100, 41000], total: 8200 * 40 + 14800 * 40 + 6100 * 15 + 41000 * 3 },
      { rfqId: "RFQ-2025-088", vendor: "GreenLeaf Stationery", rating: 4.4, delivery: "2025-07-09", unitPrices: [8900, 13900, 6700, 39800], total: 8900 * 40 + 13900 * 40 + 6700 * 15 + 39800 * 3 },
    ])

    // ── Activities ────────────────────────────────────────────────
    await ActivityModel.deleteMany({})
    await ActivityModel.insertMany([
      { type: "RFQs", tone: "success", user: "Aarav Mehta", initials: "AM", description: "RFQ created — Office Furniture Q2 Expansion" },
      { type: "Approvals", tone: "info", user: "Neha Gupta", initials: "NG", description: "Approval granted — Infra Supplies Co. ₹185,400" },
      { type: "Invoices", tone: "warning", user: "System", initials: "SY", description: "Invoice sent to vendor — OfficePro Furnishings INV-2025-0312" },
      { type: "Approvals", tone: "danger", user: "Rohan Sethi", initials: "RS", description: "Quotation rejected — PowerGrid Electricals (out of budget)" },
      { type: "Vendors", tone: "success", user: "Aarav Mehta", initials: "AM", description: "New vendor registered — TechNova Systems (pending review)" },
      { type: "Invoices", tone: "success", user: "System", initials: "SY", description: "Payment completed — GreenLeaf Stationery ₹28,760" },
      { type: "RFQs", tone: "info", user: "Neha Gupta", initials: "NG", description: "RFQ awarded — Annual Stationery Supply" },
    ])

    return NextResponse.json({
      success: true,
      message: "Database seeded with all collections!",
      defaultPassword: "password123",
    })
  } catch (error: any) {
    console.error("Seed error:", error)
    return NextResponse.json({ success: false, message: "Error: " + error.message }, { status: 500 })
  }
}
