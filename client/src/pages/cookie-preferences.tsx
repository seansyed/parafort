import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Cookie, Shield, BarChart3, Target, CheckCircle } from "lucide-react";

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookiePreferences() {
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedSettings = localStorage.getItem('cookiePreferences');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          essential: true, // Always true
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false,
          preferences: parsed.preferences || false,
        });
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
    setHasLoaded(true);
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(settings));
    
    // Apply settings to actual cookies/tracking
    if (!settings.analytics) {
      // Disable analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
    }

    if (!settings.marketing) {
      // Disable marketing cookies
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': 'denied'
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': 'granted'
        });
      }
    }

    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  const handleAcceptAll = () => {
    const newSettings = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setSettings(newSettings);
    localStorage.setItem('cookiePreferences', JSON.stringify(newSettings));

    // Enable all tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }

    toast({
      title: "All Cookies Accepted",
      description: "All cookie categories have been enabled.",
    });
  };

  const handleRejectOptional = () => {
    const newSettings = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setSettings(newSettings);
    localStorage.setItem('cookiePreferences', JSON.stringify(newSettings));

    // Disable optional tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }

    toast({
      title: "Optional Cookies Rejected",
      description: "Only essential cookies are enabled.",
    });
  };

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Preferences</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Manage how we use cookies to improve your experience on ParaFort.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* What Are Cookies Section */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Cookie className="w-6 h-6 text-green-600" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-600">
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, improving our services, 
              and understanding how you use our site.
            </p>
            <p>
              We use different types of cookies for various purposes. You can choose which categories of cookies 
              you're comfortable with below. Essential cookies are required for the website to function properly 
              and cannot be disabled.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Categories */}
        <div className="space-y-6 mb-8">
          {/* Essential Cookies */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Essential Cookies</CardTitle>
                    <p className="text-sm text-gray-600">Required for basic website functionality</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Always Active</span>
                  <Switch checked={true} disabled className="opacity-50" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                These cookies are necessary for the website to function and cannot be switched off. They are usually only 
                set in response to actions made by you which amount to a request for services, such as setting your privacy 
                preferences, logging in, or filling in forms.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Authentication and security cookies</li>
                  <li>• Session management cookies</li>
                  <li>• Shopping cart functionality</li>
                  <li>• Form submission and validation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Cookies */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Analytics Cookies</CardTitle>
                    <p className="text-sm text-gray-600">Help us understand how you use our website</p>
                  </div>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting 
                information anonymously. This helps us improve our website's performance and user experience.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Google Analytics for page views and user behavior</li>
                  <li>• Performance monitoring and error tracking</li>
                  <li>• Website usage statistics and insights</li>
                  <li>• A/B testing and optimization data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Cookies */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Marketing Cookies</CardTitle>
                    <p className="text-sm text-gray-600">Used to show you relevant advertisements</p>
                  </div>
                </div>
                <Switch
                  checked={settings.marketing}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                These cookies are used to deliver advertisements more relevant to you and your interests. They may also 
                be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Social media advertising pixels</li>
                  <li>• Retargeting and remarketing campaigns</li>
                  <li>• Cross-site tracking for ad personalization</li>
                  <li>• Advertising effectiveness measurement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Preference Cookies */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Preference Cookies</CardTitle>
                    <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                  </div>
                </div>
                <Switch
                  checked={settings.preferences}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, preferences: checked }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                These cookies enable the website to remember information that changes the way the website behaves or looks, 
                like your preferred language or the region that you are in.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Language and region preferences</li>
                  <li>• Theme and display settings</li>
                  <li>• Customized content and layout</li>
                  <li>• Saved form data and preferences</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSavePreferences}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Save My Preferences
          </Button>
          <Button
            onClick={handleAcceptAll}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold"
          >
            Accept All Cookies
          </Button>
          <Button
            onClick={handleRejectOptional}
            variant="outline"
            className="border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
          >
            Reject Optional Cookies
          </Button>
        </div>

        {/* Additional Information */}
        <Card className="mt-12 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Managing Cookies</h4>
                <p className="text-sm">
                  You can also manage cookies through your browser settings. Most browsers allow you to block or delete cookies, 
                  but this may affect the functionality of our website.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Updates to Cookie Policy</h4>
                <p className="text-sm">
                  We may update our cookie practices from time to time. When we do, we'll update this page and notify you 
                  of any significant changes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Questions?</h4>
                <p className="text-sm">
                  If you have any questions about our use of cookies, please contact us at{" "}
                  <a href="mailto:privacy@parafort.com" className="text-green-600 hover:underline">
                    privacy@parafort.com
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Rights</h4>
                <p className="text-sm">
                  You have the right to change your cookie preferences at any time by returning to this page. 
                  Your choices will be saved and respected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="h-8 w-8 mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Sales & Support</h3>
              <p className="text-gray-300">844-444-5411</p>
            </div>
            <div className="text-white">
              <div className="h-8 w-8 mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Business Hours</h3>
              <p className="text-gray-300">Monday - Friday: 8am to 5pm PST</p>
            </div>
            <div className="text-white">
              <div className="h-8 w-8 mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Sales Chat</h3>
              <p className="text-gray-300">Live chat available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}