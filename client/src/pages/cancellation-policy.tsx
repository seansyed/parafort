import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, DollarSign, FileText, Phone, Mail } from "lucide-react";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Understanding your rights and our refund policies for ParaFort services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl">Policy Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-600">
            <p>
              At ParaFort, we strive to provide exceptional service and complete customer satisfaction. This policy outlines 
              our cancellation and refund procedures for various services. We encourage you to read this policy carefully 
              and contact us if you have any questions before placing an order.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Last Updated:</strong> January 2025
            </p>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <div className="space-y-8">
          {/* Business Formation Services */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-xl">Business Formation Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Important Notice</h4>
                    <p className="text-amber-700 text-sm">
                      Once we have submitted your formation documents to the state, cancellation may not be possible. 
                      Please review your order carefully before submission.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Before State Filing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full refund available within 24 hours of order</li>
                    <li>• No questions asked cancellation policy</li>
                    <li>• Processing fee may apply after 24 hours</li>
                    <li>• Contact us immediately for fastest processing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">After State Filing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• State filing fees are non-refundable</li>
                    <li>• Service fees may be partially refundable</li>
                    <li>• Depends on completion status of services</li>
                    <li>• Case-by-case evaluation required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ongoing Services */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Ongoing Services & Subscriptions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Registered Agent</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cancel anytime with 30 days notice</li>
                    <li>• Prorated refund for unused time</li>
                    <li>• Service continues through notice period</li>
                    <li>• No cancellation fees</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bookkeeping Services</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cancel with 15 days written notice</li>
                    <li>• Final deliverables provided</li>
                    <li>• No refund for current month</li>
                    <li>• Data export available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Digital Mailbox</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cancel anytime with 30 days notice</li>
                    <li>• Mail forwarding continues through notice</li>
                    <li>• Prorated refund for annual plans</li>
                    <li>• Mail scanning stops after cancellation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* One-Time Services */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-xl">One-Time Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Refundable Services</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">EIN Application</span>
                      <span className="text-green-600 font-medium">Before submission</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Business Name Search</span>
                      <span className="text-green-600 font-medium">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Document Templates</span>
                      <span className="text-green-600 font-medium">Before download</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Compliance Calendar</span>
                      <span className="text-green-600 font-medium">Within 7 days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Non-Refundable Services</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">BOIR Filing</span>
                      <span className="text-red-600 font-medium">After submission</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Reports</span>
                      <span className="text-red-600 font-medium">After state filing</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax Filings</span>
                      <span className="text-red-600 font-medium">After IRS submission</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Custom Legal Documents</span>
                      <span className="text-red-600 font-medium">After delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-xl">How to Request a Cancellation or Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Contact Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">(844) 444-5411</p>
                        <p className="text-sm text-gray-600">Monday - Friday, 8am - 5pm PST</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">support@parafort.com</p>
                        <p className="text-sm text-gray-600">24/7 email support</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Required Information</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Order number or invoice number</li>
                    <li>• Email address associated with account</li>
                    <li>• Reason for cancellation request</li>
                    <li>• Preferred refund method</li>
                    <li>• Any relevant documentation</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Processing Timeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-blue-800">Request Review</p>
                    <p className="text-blue-700">1-2 business days</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Approval Process</p>
                    <p className="text-blue-700">2-3 business days</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Refund Processing</p>
                    <p className="text-blue-700">5-10 business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-xl">Special Circumstances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">State Rejections</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    If your business formation is rejected by the state due to our error, you will receive a full refund 
                    of all fees paid, including state fees.
                  </p>
                  <p className="text-gray-600 text-sm">
                    If rejected due to information you provided (duplicate name, incorrect details, etc.), state fees 
                    are non-refundable, but service fees may be refunded or applied to a resubmission.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Service Delays</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    If we fail to meet our stated service timelines due to internal delays (not state processing times), 
                    you may be eligible for partial refunds or service credits.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Dissatisfaction with Service</h4>
                  <p className="text-gray-600 text-sm">
                    We stand behind our work. If you're not satisfied with our service quality, please contact us 
                    immediately. We'll work to resolve any issues and may offer partial refunds or service credits 
                    on a case-by-case basis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <CardTitle className="text-xl text-amber-900">Important Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-amber-800 space-y-2">
                <li>• All refund requests must be submitted in writing (email acceptable)</li>
                <li>• Refunds are processed to the original payment method used</li>
                <li>• State filing fees paid to government agencies are generally non-refundable</li>
                <li>• Expedited processing fees are non-refundable once processing begins</li>
                <li>• This policy may be updated periodically; current version applies to all orders</li>
                <li>• Chargebacks initiated without contacting us first may result in account suspension</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cancellations?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help. Contact us before placing an order if you have questions 
            about our policies, or reach out immediately if you need to cancel an existing order.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => window.location.href = 'mailto:support@parafort.com'}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              Contact Support
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