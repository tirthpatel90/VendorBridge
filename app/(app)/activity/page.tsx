"use client"

import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type StatusTone } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { canAccess } from "@/lib/rbac"
import { useStore } from "@/lib/store-context"

const pills = ["All", "RFQs", "Approvals", "Invoices", "Vendors"] as const

const dotColor: Record<StatusTone, string> = {
  success: "bg-primary",
  warning: "bg-warning",
  info: "bg-info",
  danger: "bg-destructive",
  neutral: "bg-muted-foreground",
}

export default function ActivityPage() {
  const { user } = useAuth()
  const { activities } = useStore()
  const perm = canAccess(user?.role, "/activity")
  const [filter, setFilter] = useState<(typeof pills)[number]>("All")
  
  const filtered = activities.filter((a) => {
    const matchesFilter = filter === "All" || a.type === filter
    const matchesUser = perm === "full" || a.user === user?.name
    return matchesFilter && matchesUser
  })

  return (
    <>
      <Topbar title="Activity" />
      <PageContainer>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Activity &amp; Logs</h2>
          <p className="text-sm text-muted-foreground">Procurement audit trail</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {pills.map((p) => (
            <Button key={p} variant={filter === p ? "default" : "outline"} size="sm" onClick={() => setFilter(p)}>
              {p}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <ol className="space-y-1">
              {filtered.map((entry, i) => (
                <li key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1.5">
                    <span className={cn("size-3 rounded-full ring-4 ring-background", dotColor[entry.tone])} />
                    {i < filtered.length - 1 && <span className="my-1 w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4 pb-6">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-muted text-xs font-semibold">{entry.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-foreground">{entry.description}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {entry.user} · {entry.type}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{entry.time}</span>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="py-10 text-center text-sm text-muted-foreground">No activity for this filter.</li>
              )}
            </ol>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  )
}
