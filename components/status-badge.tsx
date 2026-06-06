import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { StatusTone } from "@/lib/data"

const toneMap: Record<string, StatusTone> = {
  // RFQ / generic
  Open: "info",
  Closed: "neutral",
  Draft: "neutral",
  Awarded: "success",
  // Vendor
  Active: "success",
  Inactive: "danger",
  Pending: "warning",
  // PO / Invoice / Quote
  Paid: "success",
  Approved: "success",
  "Pending Payment": "warning",
  Submitted: "info",
  Accepted: "success",
  Rejected: "danger",
  "Under Review": "warning",
}

const toneClasses: Record<StatusTone, string> = {
  success: "bg-accent text-accent-foreground border-transparent",
  warning: "bg-warning/15 text-warning border-transparent",
  info: "bg-info/15 text-info border-transparent",
  danger: "bg-destructive/15 text-destructive border-transparent",
  neutral: "bg-muted text-muted-foreground border-transparent",
}

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string
  tone?: StatusTone
  className?: string
}) {
  const resolved = tone ?? toneMap[status] ?? "neutral"
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium", toneClasses[resolved], className)}
    >
      {status}
    </Badge>
  )
}
