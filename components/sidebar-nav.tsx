"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PackageCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { getNavItems } from "@/lib/rbac"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  
  const navItems = user ? getNavItems(user.role) : []

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b px-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <PackageCheck className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold tracking-tight text-foreground">VendorBridge</p>
          <p className="text-xs text-muted-foreground">Procurement Suite</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-accent/60 p-3">
          <p className="text-xs font-medium text-accent-foreground">Procurement Plan</p>
          <p className="mt-1 text-xs text-muted-foreground">Enterprise · 24 seats</p>
        </div>
      </div>
    </div>
  )
}
