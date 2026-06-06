"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { spendByCategory, formatINR } from "@/lib/data"

export function SpendDonut() {
  const total = spendByCategory.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendByCategory}
              dataKey="value"
              nameKey="category"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={2}
              strokeWidth={0}
            >
              {spendByCategory.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [formatINR(value), name]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-lg font-semibold text-foreground">{formatINR(total)}</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2.5">
        {spendByCategory.map((d) => (
          <li key={d.category} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: d.fill }} />
              <span className="text-muted-foreground">{d.category}</span>
            </span>
            <span className="font-medium text-foreground">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
