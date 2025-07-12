import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Settings, 
  Mail, 
  Shield, 
  Globe, 
  Database,
  Bell,
  Users,
  CreditCard,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    siteName: "ParaFort Business Services",
    siteDescription: "Intelligent business entity formation and management platform",
    adminEmail: "admin@parafort.com",
    supportEmail: "support@parafort.com",
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
    sessionTimeout: 30
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.sendgrid.net",
    smtpPort: 587,
    smtpUsername: "apikey",
    smtpPassword: "",
    fromEmail: "noreply@parafort.com",
    fromName: "ParaFort",
    emailVerificationRequired: true,
    welcomeEmailEnabled: true
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionSecure: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
    ipWhitelistEnabled: false,
    ipWhitelist: ""
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    systemUpdates: true,
    userRegistrations: true,
    errorReports: true,
    dailyReports: false
  });

  const handleSaveSettings = async (settingsType: string, settings: any) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${settingsType} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <main className="flex-1 p-8 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Settings className="h-8 w-8 text-slate-600" />
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            </div>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General System Settings</CardTitle>
                  <CardDescription>
                    Configure basic system information and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={systemSettings.adminEmail}
                        onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="apiRateLimit">API Rate Limit (per hour)</Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={systemSettings.apiRateLimit}
                        onChange={(e) => setSystemSettings({...systemSettings, apiRateLimit: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">Temporarily disable the application for maintenance</p>
                      </div>
                      <Switch
                        id="maintenanceMode"
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="debugMode">Debug Mode</Label>
                        <p className="text-sm text-gray-500">Enable detailed error logging and debugging</p>
                      </div>
                      <Switch
                        id="debugMode"
                        checked={systemSettings.debugMode}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, debugMode: checked})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSaveSettings("General", systemSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>
                    Configure SMTP settings and email preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailVerification">Email Verification Required</Label>
                        <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                      </div>
                      <Switch
                        id="emailVerification"
                        checked={emailSettings.emailVerificationRequired}
                        onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailVerificationRequired: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="welcomeEmail">Welcome Email</Label>
                        <p className="text-sm text-gray-500">Send welcome email to new users</p>
                      </div>
                      <Switch
                        id="welcomeEmail"
                        checked={emailSettings.welcomeEmailEnabled}
                        onCheckedChange={(checked) => setEmailSettings({...emailSettings, welcomeEmailEnabled: checked})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSaveSettings("Email", emailSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Email Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                  <CardDescription>
                    Configure security policies and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                        <p className="text-sm text-gray-500">Passwords must contain special characters</p>
                      </div>
                      <Switch
                        id="requireSpecialChars"
                        checked={securitySettings.requireSpecialChars}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireSpecialChars: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Enable 2FA for admin accounts</p>
                      </div>
                      <Switch
                        id="twoFactorEnabled"
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sessionSecure">Secure Sessions</Label>
                        <p className="text-sm text-gray-500">Use secure cookie settings</p>
                      </div>
                      <Switch
                        id="sessionSecure"
                        checked={securitySettings.sessionSecure}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, sessionSecure: checked})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSaveSettings("Security", securitySettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure which notifications to send to administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Enable all email notifications</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="securityAlerts">Security Alerts</Label>
                        <p className="text-sm text-gray-500">Notify about security incidents and failed logins</p>
                      </div>
                      <Switch
                        id="securityAlerts"
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemUpdates">System Updates</Label>
                        <p className="text-sm text-gray-500">Notify about system maintenance and updates</p>
                      </div>
                      <Switch
                        id="systemUpdates"
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemUpdates: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="userRegistrations">User Registrations</Label>
                        <p className="text-sm text-gray-500">Notify when new users register</p>
                      </div>
                      <Switch
                        id="userRegistrations"
                        checked={notificationSettings.userRegistrations}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, userRegistrations: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="errorReports">Error Reports</Label>
                        <p className="text-sm text-gray-500">Notify about application errors and exceptions</p>
                      </div>
                      <Switch
                        id="errorReports"
                        checked={notificationSettings.errorReports}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, errorReports: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dailyReports">Daily Reports</Label>
                        <p className="text-sm text-gray-500">Send daily summary reports</p>
                      </div>
                      <Switch
                        id="dailyReports"
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailyReports: checked})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSaveSettings("Notification", notificationSettings)}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Configuration</CardTitle>
                  <CardDescription>
                    Advanced system settings for experienced administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          These settings can affect system performance and security. 
                          Only modify these if you understand the implications.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                      <Input
                        id="cacheTimeout"
                        type="number"
                        defaultValue="3600"
                        placeholder="3600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logLevel">Log Level</Label>
                      <Select defaultValue="info">
                        <SelectTrigger>
                          <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}