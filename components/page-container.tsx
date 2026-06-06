import type { ReactNode } from "react"

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1280px] p-4 md:p-6">{children}</div>
}
