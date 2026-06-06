import type { ReactNode } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { RouteGuard } from "@/components/route-guard"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:block">
        <div className="sticky top-0 h-screen">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <RouteGuard>
          {children}
        </RouteGuard>
      </div>
    </div>
  )
}
