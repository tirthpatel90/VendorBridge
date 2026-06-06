"use client"

import { toast } from "sonner"
import { Save, Shield, Bell, Lock, Layout, User } from "lucide-react"
import { Topbar } from "@/components/topbar"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Settings saved successfully")
  }

  return (
    <>
      <Topbar title="Settings" />
      <PageContainer>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your preferences and configurations</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSave}>
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic system configuration and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" defaultValue="English (US)" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="Asia/Kolkata (IST)" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how and when you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive daily summaries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive instant alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Approval Requests</Label>
                      <p className="text-xs text-muted-foreground">Notify when approvals are needed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your security preferences and 2FA.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-1.5 pt-4">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact View</Label>
                      <p className="text-xs text-muted-foreground">Display more data per page</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end pt-6">
              <Button type="submit" className="gap-2">
                <Save className="size-4" /> Save Settings
              </Button>
            </div>
          </form>
        </Tabs>
      </PageContainer>
    </>
  )
}
