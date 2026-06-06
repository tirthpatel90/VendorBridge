export type StatusTone = "success" | "warning" | "info" | "danger" | "neutral"

export const currentUser = {
  name: "Aarav Mehta",
  role: "Procurement Officer",
  email: "aarav.mehta@vendorbridge.io",
  initials: "AM",
}

export type Vendor = {
  id: string
  name: string
  category: string
  gst: string
  contactPerson: string
  email: string
  phone: string
  status: "Active" | "Inactive" | "Pending"
  rating: number
  bank: { name: string; account: string; ifsc: string }
  address: string
  pos: { id: string; date: string; amount: number; status: string }[]
}

export const vendors: Vendor[] = [
  {
    id: "VND-1042",
    name: "Infra Supplies Co.",
    category: "Construction Materials",
    gst: "27AABCI1234F1Z5",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@infrasupplies.in",
    phone: "+91 98200 11223",
    status: "Active",
    rating: 4.6,
    bank: { name: "HDFC Bank", account: "5012 8843 9921", ifsc: "HDFC0001234" },
    address: "Plot 14, MIDC Industrial Area, Pune, MH 411019",
    pos: [
      { id: "PO-2025-0066", date: "2025-05-12", amount: 185400, status: "Paid" },
      { id: "PO-2025-0041", date: "2025-03-08", amount: 92250, status: "Paid" },
    ],
  },
  {
    id: "VND-1043",
    name: "OfficePro Furnishings",
    category: "Office Furniture",
    gst: "29AAACO5678H1Z2",
    contactPerson: "Sneha Iyer",
    email: "sneha@officepro.com",
    phone: "+91 99453 88210",
    status: "Active",
    rating: 4.2,
    bank: { name: "ICICI Bank", account: "6233 1190 4456", ifsc: "ICIC0004412" },
    address: "22 Brigade Road, Bengaluru, KA 560001",
    pos: [{ id: "PO-2025-0059", date: "2025-04-22", amount: 134900, status: "Approved" }],
  },
  {
    id: "VND-1044",
    name: "TechNova Systems",
    category: "IT Hardware",
    gst: "07AAACT9087K1Z9",
    contactPerson: "Vikram Anand",
    email: "vikram@technova.io",
    phone: "+91 91670 45582",
    status: "Pending",
    rating: 3.9,
    bank: { name: "Axis Bank", account: "9087 2234 1100", ifsc: "UTIB0000456" },
    address: "Tower B, Cyber Hub, Gurugram, HR 122002",
    pos: [],
  },
  {
    id: "VND-1045",
    name: "GreenLeaf Stationery",
    category: "Office Supplies",
    gst: "33AAGCG2211L1Z0",
    contactPerson: "Priya Nair",
    email: "priya@greenleaf.in",
    phone: "+91 97890 22117",
    status: "Active",
    rating: 4.4,
    bank: { name: "SBI", account: "3344 7788 1290", ifsc: "SBIN0007781" },
    address: "5 Anna Salai, Chennai, TN 600002",
    pos: [{ id: "PO-2025-0051", date: "2025-04-02", amount: 28760, status: "Paid" }],
  },
  {
    id: "VND-1046",
    name: "PowerGrid Electricals",
    category: "Electrical Equipment",
    gst: "24AAFCP3344M1Z7",
    contactPerson: "Mohit Shah",
    email: "mohit@powergrid-e.com",
    phone: "+91 90990 33442",
    status: "Inactive",
    rating: 3.5,
    bank: { name: "Kotak Bank", account: "1122 5566 9900", ifsc: "KKBK0000112" },
    address: "Plot 9, GIDC Estate, Ahmedabad, GJ 382445",
    pos: [],
  },
  {
    id: "VND-1047",
    name: "SafeGuard Industrial",
    category: "Safety Equipment",
    gst: "19AAJCS6677N1Z4",
    contactPerson: "Anita Das",
    email: "anita@safeguard.co.in",
    phone: "+91 98300 77665",
    status: "Active",
    rating: 4.1,
    bank: { name: "Yes Bank", account: "7788 1234 5566", ifsc: "YESB0000334" },
    address: "44 Park Street, Kolkata, WB 700016",
    pos: [{ id: "PO-2025-0048", date: "2025-03-29", amount: 64500, status: "Paid" }],
  },
]

export type Rfq = {
  id: string
  title: string
  category: string
  status: "Open" | "Closed" | "Draft" | "Awarded"
  deadline: string
  quotations: number
  createdBy: string
}

export const rfqs: Rfq[] = [
  {
    id: "RFQ-2025-088",
    title: "Office Furniture — Q2 Expansion",
    category: "Office Furniture",
    status: "Open",
    deadline: "2025-06-18",
    quotations: 4,
    createdBy: "Aarav Mehta",
  },
  {
    id: "RFQ-2025-087",
    title: "Server Room IT Hardware Upgrade",
    category: "IT Hardware",
    status: "Open",
    deadline: "2025-06-22",
    quotations: 3,
    createdBy: "Aarav Mehta",
  },
  {
    id: "RFQ-2025-086",
    title: "Annual Stationery Supply",
    category: "Office Supplies",
    status: "Awarded",
    deadline: "2025-06-05",
    quotations: 5,
    createdBy: "Neha Gupta",
  },
  {
    id: "RFQ-2025-085",
    title: "Electrical Panel Maintenance Kit",
    category: "Electrical Equipment",
    status: "Closed",
    deadline: "2025-05-28",
    quotations: 2,
    createdBy: "Aarav Mehta",
  },
  {
    id: "RFQ-2025-084",
    title: "Site Safety Gear Procurement",
    category: "Safety Equipment",
    status: "Draft",
    deadline: "2025-06-30",
    quotations: 0,
    createdBy: "Aarav Mehta",
  },
]

export const spendByCategory = [
  { category: "IT Hardware", value: 1245000, fill: "var(--color-chart-1)" },
  { category: "Office Furniture", value: 845000, fill: "var(--color-chart-2)" },
  { category: "Construction", value: 720000, fill: "var(--color-chart-3)" },
  { category: "Electrical", value: 410000, fill: "var(--color-chart-4)" },
  { category: "Safety", value: 285000, fill: "var(--color-chart-5)" },
]

export const monthlyTrend = [
  { month: "Jan", posRaised: 18, invoicesPaid: 14 },
  { month: "Feb", posRaised: 22, invoicesPaid: 19 },
  { month: "Mar", posRaised: 27, invoicesPaid: 24 },
  { month: "Apr", posRaised: 24, invoicesPaid: 22 },
  { month: "May", posRaised: 31, invoicesPaid: 26 },
  { month: "Jun", posRaised: 29, invoicesPaid: 21 },
]

export const topVendors = [
  { name: "TechNova Systems", spend: 1245000, pos: 12, rating: 4.6 },
  { name: "OfficePro Furnishings", spend: 845000, pos: 9, rating: 4.2 },
  { name: "Infra Supplies Co.", spend: 720000, pos: 8, rating: 4.6 },
  { name: "PowerGrid Electricals", spend: 410000, pos: 6, rating: 3.5 },
  { name: "SafeGuard Industrial", spend: 285000, pos: 5, rating: 4.1 },
]

export type Quotation = {
  vendor: string
  rating: number
  delivery: string
  unitPrices: number[]
  total: number
}

export const comparisonItems = [
  { name: "Ergonomic Office Chair", qty: 40, unit: "pcs" },
  { name: "Height-Adjustable Desk", qty: 40, unit: "pcs" },
  { name: "Steel Filing Cabinet", qty: 15, unit: "pcs" },
  { name: "Conference Table (8-seater)", qty: 3, unit: "pcs" },
]

export const comparisonQuotes: Quotation[] = [
  {
    vendor: "OfficePro Furnishings",
    rating: 4.2,
    delivery: "2025-07-05",
    unitPrices: [8500, 14200, 6400, 38500],
    total: 0,
  },
  {
    vendor: "Infra Supplies Co.",
    rating: 4.6,
    delivery: "2025-07-12",
    unitPrices: [8200, 14800, 6100, 41000],
    total: 0,
  },
  {
    vendor: "GreenLeaf Stationery",
    rating: 4.4,
    delivery: "2025-07-09",
    unitPrices: [8900, 13900, 6700, 39800],
    total: 0,
  },
].map((q) => ({
  ...q,
  total: q.unitPrices.reduce((sum, p, i) => sum + p * comparisonItems[i].qty, 0),
}))

export type Activity = {
  id: string
  type: "RFQs" | "Approvals" | "Invoices" | "Vendors" | "Quotations"
  tone: StatusTone
  time: string
  user: string
  initials: string
  description: string
}

export const activities: Activity[] = [
  {
    id: "a1",
    type: "RFQs",
    tone: "success",
    time: "Today, 10:24 AM",
    user: "Aarav Mehta",
    initials: "AM",
    description: "RFQ created — Office Furniture Q2 Expansion",
  },
  {
    id: "a2",
    type: "Approvals",
    tone: "info",
    time: "Today, 09:48 AM",
    user: "Neha Gupta",
    initials: "NG",
    description: "Approval granted — Infra Supplies Co. ₹185,400",
  },
  {
    id: "a3",
    type: "Invoices",
    tone: "warning",
    time: "Yesterday, 4:12 PM",
    user: "System",
    initials: "SY",
    description: "Invoice sent to vendor — OfficePro Furnishings INV-2025-0312",
  },
  {
    id: "a4",
    type: "Approvals",
    tone: "danger",
    time: "Yesterday, 2:30 PM",
    user: "Rohan Sethi",
    initials: "RS",
    description: "Quotation rejected — PowerGrid Electricals (out of budget)",
  },
  {
    id: "a5",
    type: "Vendors",
    tone: "success",
    time: "Yesterday, 11:05 AM",
    user: "Aarav Mehta",
    initials: "AM",
    description: "New vendor registered — TechNova Systems (pending review)",
  },
  {
    id: "a6",
    type: "Invoices",
    tone: "success",
    time: "Jun 03, 5:40 PM",
    user: "System",
    initials: "SY",
    description: "Payment completed — GreenLeaf Stationery ₹28,760",
  },
  {
    id: "a7",
    type: "RFQs",
    tone: "info",
    time: "Jun 03, 1:15 PM",
    user: "Neha Gupta",
    initials: "NG",
    description: "RFQ awarded — Annual Stationery Supply",
  },
]

export const poLineItems = [
  { name: "Ergonomic Office Chair", qty: 40, unitPrice: 8200 },
  { name: "Height-Adjustable Desk", qty: 40, unitPrice: 14800 },
  { name: "Steel Filing Cabinet", qty: 15, unitPrice: 6100 },
  { name: "Conference Table (8-seater)", qty: 3, unitPrice: 41000 },
]

export type PurchaseOrder = {
  id: string
  vendor: string
  issueDate: string
  dueDate: string
  status: "Approved" | "Pending" | "Delivered" | "Paid" | "Cancelled"
  subtotal: number
  tax: number
  total: number
  items: typeof poLineItems
}

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-2025-0066",
    vendor: "Infra Supplies Co.",
    issueDate: "2025-06-04",
    dueDate: "2025-07-04",
    status: "Approved",
    subtotal: 1043500,
    tax: 187830,
    total: 1231330,
    items: poLineItems,
  },
  {
    id: "PO-2025-0065",
    vendor: "OfficePro Furnishings",
    issueDate: "2025-06-01",
    dueDate: "2025-06-30",
    status: "Delivered",
    subtotal: 450000,
    tax: 81000,
    total: 531000,
    items: [
      { name: "Executive Desk", qty: 10, unitPrice: 25000 },
      { name: "Mesh Chair", qty: 20, unitPrice: 10000 },
    ],
  },
  {
    id: "PO-2025-0064",
    vendor: "GreenLeaf Stationery",
    issueDate: "2025-05-28",
    dueDate: "2025-06-28",
    status: "Paid",
    subtotal: 24372,
    tax: 4388,
    total: 28760,
    items: [
      { name: "A4 Paper Ream", qty: 100, unitPrice: 200 },
      { name: "Notebooks", qty: 50, unitPrice: 87.44 },
    ],
  },
]

export type Invoice = {
  id: string
  poId: string
  vendor: string
  issueDate: string
  dueDate: string
  status: "Paid" | "Pending Payment" | "Overdue"
  amount: number
}

export const invoices: Invoice[] = [
  {
    id: "INV-2025-0312",
    poId: "PO-2025-0065",
    vendor: "OfficePro Furnishings",
    issueDate: "2025-06-06",
    dueDate: "2025-07-04",
    status: "Pending Payment",
    amount: 531000,
  },
  {
    id: "INV-2025-0310",
    poId: "PO-2025-0064",
    vendor: "GreenLeaf Stationery",
    issueDate: "2025-05-30",
    dueDate: "2025-06-15",
    status: "Paid",
    amount: 28760,
  },
  {
    id: "INV-2025-0305",
    poId: "PO-2025-0059",
    vendor: "OfficePro Furnishings",
    issueDate: "2025-05-01",
    dueDate: "2025-05-30",
    status: "Overdue",
    amount: 134900,
  },
]

export const approvalTimeline = [
  { time: "Jun 04, 10:24 AM", user: "Aarav Mehta", initials: "AM", action: "Submitted quotation for review", tone: "success" as StatusTone },
  { time: "Jun 04, 11:02 AM", user: "Neha Gupta", initials: "NG", action: "Moved to Under Review", tone: "info" as StatusTone },
  { time: "Jun 05, 09:48 AM", user: "Neha Gupta", initials: "NG", action: "Approved — within budget threshold", tone: "success" as StatusTone },
]

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}
