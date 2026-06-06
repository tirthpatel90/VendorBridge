import {
  LayoutDashboard,
  Building2,
  FileText,
  ClipboardList,
  CheckSquare,
  ShoppingCart,
  ReceiptText,
  BarChart3,
  Activity,
  Users,
  Settings,
  User,
} from "lucide-react"

export type Role = "admin" | "officer" | "vendor" | "manager"

export type NavItem = {
  label: string
  href: string
  icon: any
}

export function getNavItems(role: Role): NavItem[] {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Users", href: "/users", icon: Users },
        { label: "Vendors", href: "/vendors", icon: Building2 },
        { label: "Reports", href: "/reports", icon: BarChart3 },
        { label: "Activity Logs", href: "/activity", icon: Activity },
        { label: "Settings", href: "/settings", icon: Settings },
      ]
    case "officer":
      return [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Vendors", href: "/vendors", icon: Building2 },
        { label: "RFQs", href: "/rfqs", icon: FileText },
        { label: "Quotations", href: "/quotations/compare", icon: ClipboardList },
        { label: "Approvals", href: "/approvals", icon: CheckSquare },
        { label: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
        { label: "Invoices", href: "/invoices", icon: ReceiptText },
        { label: "Reports", href: "/reports", icon: BarChart3 },
      ]
    case "vendor":
      return [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "My RFQs", href: "/rfqs", icon: FileText },
        { label: "My Quotations", href: "/quotations", icon: ClipboardList },
        { label: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
        { label: "Invoices", href: "/invoices", icon: ReceiptText },
        { label: "Profile", href: "/profile", icon: User },
      ]
    case "manager":
      return [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Pending Approvals", href: "/approvals", icon: CheckSquare },
        { label: "Approval History", href: "/activity", icon: Activity },
        { label: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
        { label: "Reports", href: "/reports", icon: BarChart3 },
      ]
  }
}

export type PermissionLevel = "full" | "view" | "submit" | "own" | "none"

// Matrix mapping [role][screen] to permission level
// Screen keys matching the pathnames roughly
const permissionMatrix: Record<Role, Record<string, PermissionLevel>> = {
  admin: {
    dashboard: "full",
    users: "full",
    vendors: "full",
    rfqs: "view",
    quotations: "view",
    "quotations/compare": "view",
    approvals: "view",
    "purchase-orders": "view",
    invoices: "view",
    activity: "full",
    reports: "full",
    settings: "full",
    profile: "full",
  },
  officer: {
    dashboard: "full",
    users: "none",
    vendors: "full",
    rfqs: "full",
    quotations: "view", // officer views quotations, compare them
    "quotations/compare": "full",
    approvals: "submit", // submits for approval
    "purchase-orders": "full",
    invoices: "full",
    activity: "own",
    reports: "full",
    settings: "full",
    profile: "full",
  },
  vendor: {
    dashboard: "full",
    users: "none",
    vendors: "none",
    rfqs: "own",
    quotations: "full", // submit quotations
    "quotations/compare": "none",
    approvals: "none",
    "purchase-orders": "own",
    invoices: "own",
    activity: "own",
    reports: "none",
    settings: "full",
    profile: "full",
  },
  manager: {
    dashboard: "full",
    users: "none",
    vendors: "view",
    rfqs: "view",
    quotations: "view",
    "quotations/compare": "view",
    approvals: "full",
    "purchase-orders": "view",
    invoices: "view",
    activity: "own",
    reports: "view",
    settings: "full",
    profile: "full",
  },
}

// Function to check if a role can access a screen
export function canAccess(role: Role | undefined, path: string): PermissionLevel {
  if (!role) return "none"
  
  // Extract base path, e.g. "/vendors/new" -> "vendors"
  const segments = path.split("/").filter(Boolean)
  // Check if we are in app routes, ignore dashboard and root for base path logic, wait, dashboard is a base path
  if (segments.length === 0) return "full" // home / login
  
  // The first segment inside (app) is the actual route like 'dashboard', 'vendors'
  let base = segments[0]
  
  if (base === "quotations" && segments[1] === "compare") {
    base = "quotations/compare"
  }
  
  const screenPerm = permissionMatrix[role][base] || "none"
  return screenPerm
}
