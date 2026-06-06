"use client"

import { useEffect, useState } from "react"

type ClientDateProps = {
  options?: Intl.DateTimeFormatOptions
  className?: string
  prefix?: string
}

const defaultOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}

export function ClientDate({ options = defaultOptions, className, prefix }: ClientDateProps) {
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    setValue(new Date().toLocaleDateString("en-IN", options))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span className={className} suppressHydrationWarning>
      {value ? `${prefix ?? ""}${value}` : "\u00A0"}
    </span>
  )
}
