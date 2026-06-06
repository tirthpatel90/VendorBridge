"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { canAccess } from "@/lib/rbac"
import { Loader2 } from "lucide-react"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/")
      return
    }

    const permission = canAccess(user.role, pathname)
    if (permission === "none") {
      router.push("/dashboard")
      return
    }

    setAuthorized(true)
  }, [user, isLoading, pathname, router])

  if (isLoading || !authorized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
