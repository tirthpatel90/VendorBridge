import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Accent = "primary" | "info" | "warning" | "neutral" | "success" | "danger"

const accentStyles: Record<Accent, { icon: string }> = {
  primary: { icon: "bg-accent text-accent-foreground" },
  info: { icon: "bg-info/15 text-info" },
  warning: { icon: "bg-warning/15 text-warning" },
  neutral: { icon: "bg-muted text-muted-foreground" },
  success: { icon: "bg-green-500/15 text-green-600 dark:text-green-400" },
  danger: { icon: "bg-destructive/15 text-destructive" },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "neutral",
  trend,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  accent?: Accent
  trend?: { value: string; up: boolean }
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {trend && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                trend.up ? "text-primary" : "text-destructive",
              )}
            >
              {trend.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {trend.value}
              <span className="font-normal text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", accentStyles[accent].icon)}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
