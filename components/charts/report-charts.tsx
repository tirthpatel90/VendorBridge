"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { monthlyTrend, spendByCategory, formatINR } from "@/lib/data"

const axisStyle = { fontSize: 12, fill: "var(--color-muted-foreground)" }

export function MonthlyTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} />
        <Tooltip
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-popover-foreground)",
          }}
        />
        <Line
          type="monotone"
          dataKey="posRaised"
          name="POs Raised"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="invoicesPaid"
          name="Invoices Paid"
          stroke="var(--color-chart-3)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SpendByCategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={spendByCategory} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          interval={0}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "var(--color-muted)" }}
          formatter={(value: number) => formatINR(value)}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-popover-foreground)",
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {spendByCategory.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
