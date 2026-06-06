import { PackageCheck, ShieldCheck, Zap, Users } from "lucide-react"
import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/15">
            <PackageCheck className="size-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight">VendorBridge</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight">
            Simplify your procurement
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
            Manage vendors, RFQs, quotations, approvals, and purchase orders in one
            streamlined, audit-ready workspace.
          </p>

          <ul className="mt-8 space-y-4">
            <Feature icon={Zap} title="Faster sourcing" desc="Send RFQs and compare quotes in minutes." />
            <Feature icon={ShieldCheck} title="Audit-ready" desc="Every approval and change is logged." />
            <Feature icon={Users} title="Vendor network" desc="Onboard and rate suppliers with ease." />
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          © 2025 VendorBridge. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-card px-6 py-12 lg:w-1/2">
        <AuthForm />
      </div>
    </main>
  )
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
        <Icon className="size-[18px]" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-primary-foreground/75">{desc}</p>
      </div>
    </li>
  )
}
