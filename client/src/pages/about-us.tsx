import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Award, TrendingUp, CheckCircle, Target, Heart, Globe } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About ParaFort</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              Empowering entrepreneurs to build successful businesses through expert guidance, 
              innovative technology, and comprehensive support services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At ParaFort, we believe that every entrepreneur deserves access to professional business formation 
              services without the complexity and high costs traditionally associated with legal and compliance work.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We're on a mission to democratize business formation by providing comprehensive, affordable, 
              and technology-driven solutions that help entrepreneurs focus on what they do best - building their business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => window.location.href = '/business-formation-service'}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Start Your Business
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/contact-us'}
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
              >
                Contact Us
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
                  <p className="text-gray-600">Businesses Formed</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">98%</h3>
                  <p className="text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
                  <p className="text-gray-600">Support Available</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">50</h3>
                  <p className="text-gray-600">States Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Founded by entrepreneurs, for entrepreneurs - we understand the challenges of starting a business firsthand.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                ParaFort was born from a simple observation: business formation shouldn't be complicated, expensive, or intimidating. 
                Our founders experienced the frustration of navigating complex legal requirements, paying excessive fees, and 
                dealing with slow, unresponsive service providers when starting their own businesses.
              </p>
              <p className="leading-relaxed mb-6">
                Determined to create a better solution, we assembled a team of business formation experts, legal professionals, 
                and technology innovators to build a platform that simplifies the entire process. Our goal was to create 
                a service that combines professional expertise with modern technology to deliver fast, affordable, and 
                reliable business formation services.
              </p>
              <p className="leading-relaxed mb-6">
                Today, ParaFort serves thousands of entrepreneurs across all 50 states, helping them transform their business 
                ideas into legal entities quickly and efficiently. We've streamlined processes that used to take weeks into 
                services that can be completed in days, all while maintaining the highest standards of accuracy and compliance.
              </p>
              <p className="leading-relaxed">
                As we continue to grow, our commitment remains unchanged: to empower entrepreneurs with the tools, knowledge, 
                and support they need to build successful businesses. Every feature we develop, every service we offer, and 
                every interaction we have is guided by this fundamental mission.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we serve our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Trust & Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in honest communication, transparent pricing, and building lasting relationships with our clients.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive for perfection in every service we provide, ensuring accuracy and attention to detail.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Customer-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our clients' success is our success. Every decision we make is guided by what's best for our customers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously improve our services through technology and process innovation to better serve entrepreneurs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What Sets Us Apart Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're not just another business formation service - we're your long-term business partner.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology-Driven Approach</h3>
                  <p className="text-gray-600">
                    Our proprietary platform automates complex processes, reducing errors and speeding up formation times significantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Legal Team</h3>
                  <p className="text-gray-600">
                    Our team includes experienced business attorneys and formation specialists who ensure compliance across all jurisdictions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Support</h3>
                  <p className="text-gray-600">
                    From initial formation to ongoing compliance, we provide end-to-end support throughout your business lifecycle.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                  <p className="text-gray-600">
                    No hidden fees, no surprise charges. Our pricing is clear, competitive, and designed to provide exceptional value.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
                  <p className="text-gray-600">
                    Most formations are completed within 1-3 business days, getting your business up and running quickly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing Partnership</h3>
                  <p className="text-gray-600">
                    We're here for the long haul, providing continued support as your business grows and evolves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Business?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful entrepreneurs who chose ParaFort to launch their businesses. 
            Let us handle the paperwork so you can focus on building your dream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = '/business-formation-service'}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Start Your Business Today
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/contact-us'}
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg font-semibold"
            >
              Schedule a Consultation
            </Button>
          </div>
        </div>
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