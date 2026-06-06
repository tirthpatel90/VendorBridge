"use client"

import { toast } from "sonner"
import { Save, User as UserIcon, Mail, Phone, Building2, Briefcase, Camera } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profile updated successfully")
  }

  return (
    <>
      <Topbar title="My Profile" />
      <PageContainer>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">User Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="relative">
                  <Avatar className="size-24 border-4 border-background shadow-sm">
                    <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                      {user?.initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm hover:bg-accent/80 transition-colors">
                    <Camera className="size-4" />
                    <input type="file" className="sr-only" accept="image/*" />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.roleLabel}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="size-4 text-muted-foreground" /> Personal Information
                </CardTitle>
                <CardDescription>Update your personal and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={user?.name || ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" defaultValue={user?.email || ""} className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="phone" defaultValue={user?.phone || "+91 98765 43210"} className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role">System Role</Label>
                    <Input id="role" defaultValue={user?.roleLabel || ""} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="size-4 text-muted-foreground" /> Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="department" defaultValue={user?.role === 'vendor' ? "Sales & Partnerships" : "Procurement"} className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="company" defaultValue={user?.role === 'vendor' ? "Infra Supplies Co." : "VendorBridge ERP Inc."} className="pl-9" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="gap-2">
                <Save className="size-4" /> Update Profile
              </Button>
            </div>
          </div>
        </form>
      </PageContainer>
    </>
  )
}
