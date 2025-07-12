import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Building,
  Mail,
  Download,
  Upload,
  Camera,
  Monitor,
  History as HistoryIcon,
  UserPlus,
  Users,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import LeftNavigation from "@/components/left-navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    browser: false,
    compliance: false,
    marketing: false
  });

  const [billingSubTab, setBillingSubTab] = useState("subscriptions");
  const [profileUpdateInProgress, setProfileUpdateInProgress] = useState(false);
  const [billing, setBilling] = useState({
    subscription: null,
    paymentMethods: [],
    invoices: []
  });

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: "",
    timezone: "UTC",
    profileImageUrl: user?.profileImageUrl || ""
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 30,
    loginNotifications: true
  });

  const [activeTab, setActiveTab] = useState("profile");
  
  // User Access delegation state
  const [userAccess, setUserAccess] = useState({
    authorizedEmail: "",
    authorizedName: "",
    relationship: "accountant"
  });

  // Handle plan upgrade functionality
  const handleUpgradePlan = (businessId: number, currentPlan: string) => {
    toast({
      title: "Plan Upgrade",
      description: `Upgrading plan for business ID ${businessId} from ${currentPlan || 'Free'} plan. Redirecting to upgrade portal...`,
    });
    // Future: Navigate to upgrade flow or open upgrade modal
  };

  // Fetch notification preferences
  const { data: savedNotifications } = useQuery({
    queryKey: ["/api/user/notifications"],
    retry: false,
  });

  // Fetch 2FA status
  const { data: twoFactorStatus } = useQuery({
    queryKey: ["/api/auth/2fa/status"],
    retry: false,
  });

  // Fetch billing data
  const { data: billingData, isLoading: isBillingLoading } = useQuery({
    queryKey: ["/api/billing/subscription"],
    retry: false,
  });

  // Fetch invoices
  const { data: invoicesData, isLoading: isInvoicesLoading, error: invoicesError } = useQuery({
    queryKey: ["/api/billing/invoices"],
    retry: false,
  });

  // Fetch business subscriptions
  const { data: businessSubscriptionsData, isLoading: isBusinessSubscriptionsLoading } = useQuery({
    queryKey: ["/api/billing/business-subscriptions"],
    retry: false,
  });

  // Fetch authorized users
  const { data: authorizedUsers, isLoading: isAuthorizedUsersLoading } = useQuery({
    queryKey: ["/api/authorized-users"],
    retry: false,
  });



  // Update profile state when user data changes (but not during active profile updates)
  useEffect(() => {
    if (user && !profileUpdateInProgress) {
      setProfile(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImageUrl: user.profileImageUrl || ""
      }));
    }
  }, [user, profileUpdateInProgress]);

  // Update notification state when saved preferences are loaded
  useEffect(() => {
    if (savedNotifications && typeof savedNotifications === 'object' && 'email' in savedNotifications) {
      setNotifications({
        email: savedNotifications.email ?? false,
        sms: savedNotifications.sms ?? false,
        browser: savedNotifications.browser ?? false,
        compliance: savedNotifications.compliance ?? false,
        marketing: savedNotifications.marketing ?? false
      });
    }
  }, [savedNotifications]);

  // Update security state when 2FA status is loaded
  useEffect(() => {
    if (twoFactorStatus && typeof twoFactorStatus === 'object' && 'enabled' in twoFactorStatus) {
      setSecurity(prev => ({
        ...prev,
        twoFactorEnabled: twoFactorStatus.enabled ?? false
      }));
    }
  }, [twoFactorStatus]);

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      setProfileUpdateInProgress(true);
      console.log('Saving profile data:', data);
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      const result = await response.json();
      console.log('Profile save response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Profile update successful:', data);
      
      // Update the profile state immediately with the returned data
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        company: profile.company,
        timezone: profile.timezone,
        profileImageUrl: data.profileImageUrl || ""
      });
      
      // Force complete cache invalidation and refetch with timestamp
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
      
      // Wait a moment then refetch to ensure cache is cleared
      setTimeout(() => {
        queryClient.refetchQueries({ 
          queryKey: ["/api/auth/user"], 
          type: 'active',
          exact: true
        });
      }, 100);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Reset the update flag after operations complete
      setTimeout(() => {
        setProfileUpdateInProgress(false);
      }, 500);
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      setProfileUpdateInProgress(false);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Notification preferences mutation
  const notificationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/user/notifications", data);
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
      // Refresh the notification preferences data
      queryClient.invalidateQueries({ queryKey: ["/api/user/notifications"] });
    },
    onError: (error: any) => {
      console.error("Notification update error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update preferences",
        variant: "destructive",
      });
    },
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    const newNotifications = {
      ...notifications,
      [type]: value
    };
    
    setNotifications(newNotifications);
    
    // Immediately save to backend
    notificationMutation.mutate(newNotifications);
  };

  const handleSecurityChange = (key: keyof typeof security, value: boolean | number) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
    
    // Handle 2FA toggle
    if (key === 'twoFactorEnabled') {
      if (value === true) {
        setup2FA();
      } else {
        disable2FA();
      }
    }
  };

  const setup2FA = async () => {
    try {
      const response = await apiRequest('POST', '/api/auth/2fa/setup', {});
      const data = await response.json();
      
      toast({
        title: "Two-Factor Authentication Enabled",
        description: "2FA has been activated for your account.",
      });
      
      // Invalidate the 2FA status query to refresh the state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/2fa/status"] });
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to enable 2FA",
        variant: "destructive",
      });
      setSecurity(prev => ({ ...prev, twoFactorEnabled: false }));
    }
  };

  const disable2FA = async () => {
    try {
      const response = await apiRequest('POST', '/api/auth/2fa/disable', {});
      const data = await response.json();
      
      toast({
        title: "Two-Factor Authentication Disabled",
        description: "2FA has been turned off for your account.",
      });
      
      // Invalidate the 2FA status query to refresh the state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/2fa/status"] });
    } catch (error: any) {
      toast({
        title: "Disable Failed",
        description: error.message || "Failed to disable 2FA",
        variant: "destructive",
      });
      setSecurity(prev => ({ ...prev, twoFactorEnabled: true }));
    }
  };

  // Phone number validation for Telnyx E.164 format
  const validatePhoneNumber = (phone: string): boolean => {
    // E.164 format: +[country code][number] (max 15 digits total)
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  };

  // Auto-format phone number to E.164 format
  const formatToE164 = (phone: string): string => {
    if (!phone) return "";
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // If it's empty after cleaning, return empty
    if (!digitsOnly) return "";
    
    // Minimum 10 digits required for auto-formatting
    if (digitsOnly.length < 10) {
      // Don't auto-format if less than 10 digits, just return original input
      // This prevents incorrect formatting like "916407002" -> "+1916407002"
      return phone;
    }
    
    // If it already starts with +, just clean and validate
    if (phone.startsWith('+')) {
      const cleaned = '+' + digitsOnly;
      return cleaned.length <= 16 ? cleaned : phone; // Don't format if too long
    }
    
    // Auto-add country code based on length and patterns (only for 10+ digits)
    if (digitsOnly.length === 10) {
      // US/Canada number (10 digits)
      return '+1' + digitsOnly;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      // US/Canada with country code
      return '+' + digitsOnly;
    } else if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      // International number - assume they know their country code
      // For most international numbers, add + prefix
      return '+' + digitsOnly;
    }
    
    // If we can't determine format, return original input
    return phone;
  };

  const handleProfileChange = (field: string, value: string) => {
    if (field === 'phone') {
      // Auto-format phone number to E.164
      const formattedPhone = formatToE164(value);
      setProfile(prev => ({
        ...prev,
        [field]: formattedPhone
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleProfileSave = () => {
    // Validate phone number if provided
    if (profile.phone) {
      const digitsOnly = profile.phone.replace(/\D/g, '');
      
      if (digitsOnly.length < 10) {
        toast({
          title: "Phone Number Too Short",
          description: "Please enter at least 10 digits for a valid phone number.",
          variant: "destructive",
        });
        return;
      }
      
      if (!validatePhoneNumber(profile.phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number format for SMS/OTP functionality.",
          variant: "destructive",
        });
        return;
      }
    }

    profileMutation.mutate(profile);
  };

  const handleNotificationSave = () => {
    notificationMutation.mutate(notifications);
  };

  // Profile image upload mutation
  const profileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profileImage', file);
      return await apiRequest("POST", "/api/user/upload-profile-picture", formData);
    },
    onSuccess: (data: any) => {
      setProfile(prev => ({
        ...prev,
        profileImageUrl: data.profileImageUrl
      }));
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    },
  });

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Profile picture must be smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, or GIF).",
          variant: "destructive",
        });
        return;
      }

      profileImageMutation.mutate(file);
    }
  };

  // Authorized Users mutations
  const addAuthorizedUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/authorized-users", data);
    },
    onSuccess: () => {
      toast({
        title: "Authorized User Added",
        description: "The user has been successfully authorized to access your account.",
      });
      setUserAccess({
        authorizedEmail: "",
        authorizedName: "",
        relationship: "accountant"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/authorized-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Authorization Failed",
        description: error.message || "Failed to authorize user",
        variant: "destructive",
      });
    },
  });

  const removeAuthorizedUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("DELETE", `/api/authorized-users/${userId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Authorization Revoked",
        description: "The user's access has been successfully revoked.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/authorized-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Revocation Failed",
        description: error.message || "Failed to revoke user access",
        variant: "destructive",
      });
    },
  });

  const handleAddAuthorizedUser = () => {
    if (!userAccess.authorizedEmail || !userAccess.authorizedName) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and name for the authorized user.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userAccess.authorizedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    addAuthorizedUserMutation.mutate(userAccess);
  };

  const handleRemoveAuthorizedUser = (userId: number) => {
    removeAuthorizedUserMutation.mutate(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 pt-32">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-8 w-8 text-green-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account preferences and configuration</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="user-access">User Access</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profile.profileImageUrl} alt="Profile" />
                          <AvatarFallback className="text-lg">
                            {(profile.firstName?.[0] || user?.firstName?.[0] || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <label htmlFor="profile-image" className={`absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-colors ${profileImageMutation.isPending ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                          {profileImageMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                          <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                            disabled={profileImageMutation.isPending}
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                        <p className="text-sm text-gray-500">Upload a new profile picture</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max file size 2MB.</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => handleProfileChange("firstName", e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => handleProfileChange("lastName", e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                        placeholder="Enter phone number (auto-formatted to E.164)"
                      />
                      <p className="text-xs text-gray-500">
                        Minimum 10 digits required. Enter any format - automatically converted to E.164 for Telnyx SMS/OTP. Examples: 1234567890 → +11234567890
                      </p>
                    </div>

                    <button 
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: profileMutation.isPending ? 'not-allowed' : 'pointer',
                        opacity: profileMutation.isPending ? 0.5 : 1,
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!profileMutation.isPending) {
                          e.target.style.backgroundColor = '#059669';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!profileMutation.isPending) {
                          e.target.style.backgroundColor = '#10b981';
                        }
                      }}
                      onClick={handleProfileSave}
                      disabled={profileMutation.isPending}
                    >
                      {profileMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about important updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(value) => handleNotificationChange("email", value)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(value) => handleNotificationChange("sms", value)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Browser Notifications</Label>
                          <p className="text-sm text-gray-500">Show notifications in your browser</p>
                        </div>
                        <Switch
                          checked={notifications.browser}
                          onCheckedChange={(value) => handleNotificationChange("browser", value)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Compliance Alerts</Label>
                          <p className="text-sm text-gray-500">Important compliance and deadline reminders</p>
                        </div>
                        <Switch
                          checked={notifications.compliance}
                          onCheckedChange={(value) => handleNotificationChange("compliance", value)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Marketing Communications</Label>
                          <p className="text-sm text-gray-500">Product updates and promotional content</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(value) => handleNotificationChange("marketing", value)}
                        />
                      </div>
                    </div>

                    <button 
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: notificationMutation.isPending ? 'not-allowed' : 'pointer',
                        opacity: notificationMutation.isPending ? 0.5 : 1,
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!notificationMutation.isPending) {
                          e.target.style.backgroundColor = '#059669';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!notificationMutation.isPending) {
                          e.target.style.backgroundColor = '#10b981';
                        }
                      }}
                      onClick={handleNotificationSave}
                      disabled={notificationMutation.isPending}
                    >
                      {notificationMutation.isPending ? "Saving..." : "Save Preferences"}
                    </button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                {activeTab === "sessions" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5" />
                        <span>Active Sessions</span>
                      </CardTitle>
                      <CardDescription>
                        Manage your active login sessions across devices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-gray-500">Desktop • Chrome • Current Location</p>
                              <p className="text-sm text-gray-400">Last active: Now</p>
                            </div>
                            <Badge variant="outline">Current</Badge>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setActiveTab("profile")}>
                          Back to Security
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : activeTab === "activity" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <HistoryIcon className="h-5 w-5" />
                        <span>Account Activity</span>
                      </CardTitle>
                      <CardDescription>
                        Review recent account activity and security events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Account Login</p>
                              <p className="text-sm text-gray-500">Desktop • Chrome</p>
                              <p className="text-sm text-gray-400">Just now</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setActiveTab("profile")}>
                          Back to Security
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">Account Security Status</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Your account is secured with Replit authentication
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900">Security Features</h3>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <Switch
                            checked={security.twoFactorEnabled}
                            onCheckedChange={(value) => handleSecurityChange("twoFactorEnabled", value)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Session Management</Label>
                            <p className="text-sm text-gray-500">View and manage active sessions</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("sessions")}>
                            Manage Sessions
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <Label className="font-medium">Account Activity Log</Label>
                            <p className="text-sm text-gray-500">Review recent account activity</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("activity")}>
                            View Activity
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )}
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Billing & Subscriptions</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your subscriptions and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Billing Sub-Tabs Navigation */}
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setBillingSubTab("subscriptions")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            billingSubTab === "subscriptions"
                              ? "border-green-500 text-green-500"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Subscriptions
                        </button>
                        <button
                          onClick={() => setBillingSubTab("recent-invoices")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            billingSubTab === "recent-invoices"
                              ? "border-green-500 text-green-500"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Recent Invoices
                        </button>
                        <button
                          onClick={() => setBillingSubTab("all-invoices")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            billingSubTab === "all-invoices"
                              ? "border-green-500 text-green-500"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          View All Invoices
                        </button>
                        <button
                          onClick={() => setBillingSubTab("payment-methods")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            billingSubTab === "payment-methods"
                              ? "border-green-500 text-green-500"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Manage Payment Information
                        </button>
                        <button
                          onClick={() => setBillingSubTab("billing-support")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            billingSubTab === "billing-support"
                              ? "border-green-500 text-green-500"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Billing Support
                        </button>
                      </nav>
                    </div>

                    {/* Sub-Tab Content */}
                    <div className="mt-6">
                      {billingSubTab === "subscriptions" && (
                        <div className="space-y-4">
                          {isBillingLoading ? (
                            <div className="flex items-center justify-center p-8">
                              <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                            </div>
                          ) : (
                            <>
                              {/* Business Subscriptions Section */}
                              {businessSubscriptionsData?.businessSubscriptions && businessSubscriptionsData.businessSubscriptions.length > 0 ? (
                                <div className="space-y-3">
                                  <h3 className="text-lg font-medium text-gray-900">Business Subscriptions</h3>
                                  <div className="space-y-3">
                                    {businessSubscriptionsData.businessSubscriptions.map((business: any) => (
                                      <div key={business.businessId} className="p-4 border rounded-lg bg-white">
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                              <Building className="w-5 h-5 text-green-500" />
                                              <div>
                                                <h4 className="font-medium text-gray-900">{business.businessName}</h4>
                                                <p className="text-sm text-gray-500">{business.entityType} • {business.state}</p>
                                                {business.subscriptionStatus && (
                                                  <Badge 
                                                    variant={business.subscriptionStatus === 'active' ? 'default' : 'secondary'}
                                                    className="text-xs mt-1"
                                                  >
                                                    {business.subscriptionStatus}
                                                  </Badge>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right flex items-center gap-3">
                                            <div>
                                              <Badge 
                                                className={`${
                                                  business.plan?.name === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                                  business.plan?.name === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                                  business.plan?.name === 'Bronze' ? 'bg-orange-100 text-orange-800' :
                                                  !business.plan?.name ? 'bg-red-100 text-red-800' :
                                                  'bg-blue-100 text-blue-800'
                                                }`}
                                              >
                                                {business.plan?.name || 'No Plan'}
                                              </Badge>
                                              {business.plan?.yearlyPrice && business.plan.yearlyPrice > 0 && (
                                                <p className="text-sm text-gray-600 mt-1">${business.plan.yearlyPrice}/year</p>
                                              )}
                                            </div>
                                            <button 
                                              style={{
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                transition: 'background-color 0.2s'
                                              }}
                                              onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#059669';
                                              }}
                                              onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#10b981';
                                              }}
                                              onClick={() => handleUpgradePlan(business.businessId, business.plan?.name)}
                                            >
                                              Upgrade
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                  <p>No active subscriptions</p>
                                  <p className="text-sm">Start by creating your first business entity</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {billingSubTab === "recent-invoices" && (
                        <div className="space-y-4">
                          {isBillingLoading ? (
                            <div className="flex items-center justify-center p-8">
                              <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                            </div>
                          ) : (
                            <>
                              {invoicesData?.invoices && invoicesData.invoices.length > 0 ? (
                                <div className="space-y-3">
                                  <h3 className="text-lg font-medium text-gray-900">Recent Invoices (Last 5)</h3>
                                  <div className="space-y-2">
                                    {invoicesData.invoices.slice(0, 5).map((invoice: any) => (
                                      <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                                          <p className="text-sm text-gray-500">${(invoice.amount / 100).toFixed(2)} - {invoice.status}</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                          <Download className="w-4 h-4 mr-2" />
                                          Download
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                  <p>No invoices available</p>
                                  <p className="text-sm">Your invoices will appear here once generated</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {billingSubTab === "all-invoices" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">All Invoices</h3>
                            <button 
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#059669';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#10b981';
                              }}
                              onClick={() => navigate('/invoices')}
                            >
                              <Download className="w-4 h-4" />
                              View Full Invoice History
                            </button>
                          </div>
                          {isBillingLoading ? (
                            <div className="flex items-center justify-center p-8">
                              <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                            </div>
                          ) : (
                            <>
                              {invoicesData?.invoices && invoicesData.invoices.length > 0 ? (
                                <div className="space-y-2">
                                  {invoicesData.invoices.map((invoice: any) => (
                                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500">${(invoice.amount / 100).toFixed(2)} - {invoice.status}</p>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                  <p>No invoices available</p>
                                  <p className="text-sm">Your complete invoice history will appear here</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {billingSubTab === "payment-methods" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                            <button 
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#059669';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#10b981';
                              }}
                              onClick={() => navigate('/payment-methods')}
                            >
                              <CreditCard className="w-4 h-4" />
                              Manage Payment Methods
                            </button>
                          </div>
                          <div className="p-6 border rounded-lg bg-gray-50">
                            <div className="text-center">
                              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <h4 className="text-lg font-medium text-gray-900 mb-2">Secure Payment Management</h4>
                              <p className="text-gray-600 mb-4">
                                Manage your credit cards, billing addresses, and payment preferences in one secure location.
                              </p>
                              <div className="space-y-2 text-sm text-gray-500">
                                <p>• Add, remove, or update payment methods</p>
                                <p>• Set default payment options</p>
                                <p>• View payment history and receipts</p>
                                <p>• Update billing information</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {billingSubTab === "billing-support" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Billing Support</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 border rounded-lg bg-blue-50">
                              <div className="flex items-center space-x-3 mb-4">
                                <Mail className="w-8 h-8 text-blue-600" />
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900">Contact Support</h4>
                                  <p className="text-sm text-gray-600">Get help with billing questions</p>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4">
                                Our billing support team is here to help with any questions about your invoices, payments, or subscription plans.
                              </p>
                              <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => window.open('https://help.parafort.com/en', '_blank')}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Contact Billing Support
                              </Button>
                            </div>
                            
                            <div className="p-6 border rounded-lg bg-green-50">
                              <div className="flex items-center space-x-3 mb-4">
                                <Download className="w-8 h-8 text-green-600" />
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900">Download Resources</h4>
                                  <p className="text-sm text-gray-600">Billing guides and documentation</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                  <Download className="w-4 h-4 mr-2" />
                                  Billing FAQ Guide
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <Download className="w-4 h-4 mr-2" />
                                  Payment Methods Guide
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <Download className="w-4 h-4 mr-2" />
                                  Subscription Plans Overview
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Access Tab */}
              <TabsContent value="user-access" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Account Access Management</span>
                    </CardTitle>
                    <CardDescription>
                      Authorize one additional user to view your account information (viewing only, no order placement)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Authorized Users */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Authorized Users</h3>
                      {isAuthorizedUsersLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full"></div>
                        </div>
                      ) : authorizedUsers && authorizedUsers.length > 0 ? (
                        <div className="space-y-3">
                          {authorizedUsers.map((authUser: any) => (
                            <div key={authUser.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{authUser.authorizedName}</h4>
                                  <p className="text-sm text-gray-500">{authUser.authorizedEmail}</p>
                                  <p className="text-sm text-blue-600 font-medium capitalize">{authUser.relationship}</p>
                                  <p className="text-xs text-gray-400">Added on {new Date(authUser.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveAuthorizedUser(authUser.id)}
                                  disabled={removeAuthorizedUserMutation.isPending}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  {removeAuthorizedUserMutation.isPending ? (
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No authorized users</p>
                          <p className="text-sm">You can authorize one additional user to view your account</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Add New Authorized User - Only show if no users exist (limit of 1) */}
                    {(!authorizedUsers || authorizedUsers.length === 0) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Authorize New User</h3>
                        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-medium">Important Security Notice</p>
                              <ul className="mt-2 space-y-1 list-disc list-inside">
                                <li>Authorized users can <strong>view</strong> your account information only</li>
                                <li>They <strong>cannot</strong> place new orders or make changes</li>
                                <li>Only <strong>one</strong> additional user can be authorized at a time</li>
                                <li>You can revoke access at any time</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                              type="text"
                              placeholder="Enter full name"
                              value={userAccess.authorizedName}
                              onChange={(e) => setUserAccess({ ...userAccess, authorizedName: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                              type="email"
                              placeholder="Enter email address"
                              value={userAccess.authorizedEmail}
                              onChange={(e) => setUserAccess({ ...userAccess, authorizedEmail: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Relationship</label>
                          <select
                            value={userAccess.relationship}
                            onChange={(e) => setUserAccess({ ...userAccess, relationship: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="accountant">Accountant</option>
                            <option value="attorney">Attorney</option>
                            <option value="consultant">Consultant</option>
                            <option value="assistant">Assistant</option>
                            <option value="partner">Business Partner</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <Button
                          onClick={handleAddAuthorizedUser}
                          disabled={addAuthorizedUserMutation.isPending || !userAccess.authorizedEmail || !userAccess.authorizedName}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          {addAuthorizedUserMutation.isPending ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Authorizing User...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <UserPlus className="w-4 h-4" />
                              <span>Authorize User</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Show limitation message if already at limit */}
                    {authorizedUsers && authorizedUsers.length >= 1 && (
                      <div className="p-4 border rounded-lg bg-amber-50">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-medium">Authorization Limit Reached</p>
                            <p className="mt-1">Only one additional user can be authorized at a time. To authorize a different user, please revoke access for the current authorized user first.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}