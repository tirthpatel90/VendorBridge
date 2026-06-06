"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Camera, Loader2, PackageCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { useAuth } from "@/lib/auth-context"
import { Role } from "@/lib/rbac"

type Mode = "signin" | "register"

export function AuthForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [mode, setMode] = useState<Mode>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(form: FormData): Record<string, string> {
    const e: Record<string, string> = {}
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")
    if (!email) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address"
    if (!password) e.password = "Password is required"
    else if (password.length < 6) e.password = "Password must be at least 6 characters"

    if (mode === "register") {
      if (!form.get("firstName")) e.firstName = "First name is required"
      if (!form.get("lastName")) e.lastName = "Last name is required"
      if (!form.get("role")) e.role = "Please select a role"
    }
    return e
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    
    setSubmitting(true)
    
    try {
      if (mode === "register") {
        const payload = Object.fromEntries(form.entries())
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        
        if (res.ok && data.success) {
          login(data.user)
          router.push("/dashboard")
        } else {
          setErrors({ email: data.message || "Registration failed" })
        }
      } else {
        const email = String(form.get("email"))
        const password = String(form.get("password"))
        
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        
        if (res.ok && data.success) {
          login(data.user)
          router.push("/dashboard")
        } else {
          setErrors({ email: data.message || "Invalid credentials" })
        }
      }
    } catch (err) {
      console.error("Auth error", err)
      setErrors({ email: "Network error. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage your procurement workflow"
            : "Get started with VendorBridge in a few steps"}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {mode === "register" && (
          <div className="flex justify-center pb-2">
            <div className="group relative flex size-24 items-center justify-center rounded-2xl bg-primary shadow-sm">
              <PackageCheck className="size-12 text-primary-foreground" />
            </div>
          </div>
        )}

        {mode === "register" && (
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Field label="First Name" name="firstName" placeholder="First Name" error={errors.firstName} />
            <Field label="Last Name" name="lastName" placeholder="Last Name" error={errors.lastName} />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              className={cn("pl-9", errors.email && "border-destructive")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn("pl-9 pr-9", errors.password && "border-destructive")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {mode === "register" && (
          <>
            <Field label="Phone" name="phone" type="tel" placeholder="+91       " />
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select name="role">
                <SelectTrigger id="role" className={cn("w-full", errors.role && "border-destructive")}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="officer">Procurement Officer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
            </div>
            <Field label="Country" name="country" placeholder="India" />
            <div className="space-y-1.5">
              <Label htmlFor="info">Additional Information</Label>
              <Textarea id="info" name="info" placeholder="Tell us about your organization..." rows={3} />
            </div>
          </>
        )}

        {mode === "signin" && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-4 rounded border-border accent-primary" />
              Remember me
            </label>
            <button type="button" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </button>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signin" ? "register" : "signin"))
            setErrors({})
          }}
          className="font-medium text-primary hover:underline"
        >
          {mode === "signin" ? "Create account" : "Sign in"}
        </button>
      </p>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} className={cn(error && "border-destructive")} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
