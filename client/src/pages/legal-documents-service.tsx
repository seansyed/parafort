import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, Download, Eye, Edit, Lock } from "lucide-react";

export default function LegalDocumentsService() {
  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/9"; // Documents service
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Legal Documents</span>
                <span className="block text-green-500">& Templates</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Access professional legal documents and templates for your business. From operating agreements to contracts, get legally compliant documents prepared by experienced attorneys.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={handleGetStarted}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: '600',
                    padding: '24px 48px',
                    borderRadius: '8px',
                    fontSize: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease-in-out',
                    transform: 'translateY(0)',
                    marginRight: '16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Browse Documents
                </button>
                <button
                  onClick={handleContactUs}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#10b981',
                    fontWeight: '600',
                    padding: '24px 48px',
                    borderRadius: '8px',
                    fontSize: '20px',
                    border: '2px solid #10b981',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Speak to Expert
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="text-center">
                    <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Legal Documents</h3>
                    <p className="text-gray-600 mb-6">Get instant access to attorney-drafted legal templates and custom document creation services.</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>Attorney Reviewed</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>State Compliant</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>Instant Download</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>Expert Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Documents Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Most Popular Documents
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Frequently requested legal documents for businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">LLC Operating Agreement</h3>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <Download className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive operating agreement for LLCs with member management structure and profit distribution terms.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-500">$149</span>
                  <button
                    onClick={handleGetStarted}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }}
                  >
                    Get Document
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Non-Disclosure Agreement</h3>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <Download className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Protect confidential information with this comprehensive NDA template for business relationships.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-500">$99</span>
                  <button
                    onClick={handleContactUs}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }}
                  >
                    Request Custom Document
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Employment Contract</h3>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <Download className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Professional employment agreement with confidentiality, non-compete, and termination clauses.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-500">$199</span>
                  <button
                    onClick={handleGetStarted}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }}
                  >
                    Get Document
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Custom Document Services</h3>
              <p className="text-lg text-gray-600 mb-8">
                Need a document that's not in our template library? Our experienced attorneys can draft custom legal documents tailored to your specific business needs.
              </p>
              <button
                onClick={handleContactUs}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 48px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Request Custom Document
              </button>
            </div>
            <div className="mt-12 lg:mt-0">
              <Card className="border-2 border-green-500 shadow-xl" style={{ backgroundColor: '#c4fed9' }}>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Custom Document Pricing</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Simple Documents</span>
                      <span className="font-semibold text-green-500">$500 - $1,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Complex Agreements</span>
                      <span className="font-semibold text-green-500">$1,000 - $2,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Corporate Documents</span>
                      <span className="font-semibold text-green-500">$1,500 - $3,000</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Rush Service (48 hours)</span>
                        <span className="font-semibold text-green-500">+50%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common questions about our legal documents
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Are your documents legally binding?</h3>
              <p className="text-gray-600">Yes, all our documents are drafted by licensed attorneys and are legally binding when properly executed. However, we recommend having documents reviewed by local counsel for complex situations.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I modify the documents after download?</h3>
              <p className="text-gray-600">Yes, our documents are provided in editable formats (Word, PDF) that allow you to customize them for your specific needs. We also provide guidance on key sections to modify.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How quickly can I get custom documents?</h3>
              <p className="text-gray-600">Standard custom documents are delivered within 5-7 business days. Rush service (48-hour delivery) is available for an additional 50% fee.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you provide legal advice with documents?</h3>
              <p className="text-gray-600">While we provide guidance on document usage and completion, we don't provide legal advice. For complex legal matters, we recommend consulting with a qualified attorney in your jurisdiction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>1-800-123-4567</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>documents@parafort.com</span>
                </div>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <div className="space-y-1">
                <p>Monday - Friday: 9AM - 6PM EST</p>
                <p>Saturday: 10AM - 4PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Expert Support</h3>
              <div className="space-y-1">
                <p>Document Review</p>
                <p>Custom Services</p>
                <p>Legal Guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}