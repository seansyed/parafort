import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, Edit, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
const panthersSignupImg = "/business-name-change.jpg";

export default function BusinessLegalNameChange() {
  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/15"; // Business Legal Name Change Service
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
                <span className="block">Business Legal</span>
                <span className="block text-green-500">Name Change Service</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Change your business name legally and efficiently with our comprehensive name change services. We handle all the paperwork, state filings, and compliance requirements to ensure your business name change is complete and properly registered.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={handleGetStarted}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 min-h-[60px] w-full sm:w-auto border-0 transition-all duration-200 mr-4"
                  style={{ 
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Start Name Change
                  </span>
                </button>
                <Button
                  onClick={handleContactUs}
                  variant="outline"
                  className="bg-transparent border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
                ><span className="text-white font-semibold">Get Free Consultation</span></Button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Edit className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Professional Name Change</h3>
                      <p className="text-lg mt-2 opacity-90">Legal & Compliant</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Service Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={panthersSignupImg}
                    alt="Professional business workspace"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Change Your Business Name Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Change Your Business Name?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common reasons businesses choose to change their legal name
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Growth</h3>
              <p className="text-gray-600">Expanding services or markets requires a name that reflects your new direction</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rebranding</h3>
              <p className="text-gray-600">Update your brand image to better connect with customers and markets</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Compliance</h3>
              <p className="text-gray-600">Resolve trademark issues or comply with regulatory requirements</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ownership Changes</h3>
              <p className="text-gray-600">New partners or ownership structure requires name update</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Positioning</h3>
              <p className="text-gray-600">Better positioning in your industry or target market</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing Benefits</h3>
              <p className="text-gray-600">Improve brand recognition and customer recall</p>
            </div>
          </div>
        </div>
      </section>

      {/* Name Change Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Name Change Process
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our comprehensive approach to changing your business name
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Name Availability Check</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Search state business registry
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Check trademark databases
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Verify domain availability
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Confirm compliance requirements
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Document Preparation</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Amendment articles preparation
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Board resolution drafting
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Certificate application
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Supporting documentation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">State Filing</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    File with Secretary of State
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Pay required filing fees
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Handle expedited processing
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Obtain certified copies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">IRS & Tax Updates</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Update EIN records
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Notify state tax agencies
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Update tax registrations
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Modify business licenses
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Banking & Accounts</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Update bank accounts
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Modify credit accounts
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Update merchant accounts
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Revise payment processors
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">6</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Final Updates</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Update contracts & agreements
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Notify vendors & suppliers
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Update insurance policies
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Revise marketing materials
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Required Documents for Name Change
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Essential paperwork for your business name change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Articles of Amendment</h3>
                <p className="text-gray-600">Official document to change the business name on state records</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Board Resolution</h3>
                <p className="text-gray-600">Corporate approval for the name change decision</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Name Availability Certificate</h3>
                <p className="text-gray-600">Proof that the new name is available for use</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate of Good Standing</h3>
                <p className="text-gray-600">Current compliance status with the state</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Filing Fees</h3>
                <p className="text-gray-600">Required state fees for processing the name change</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Supporting Documents</h3>
                <p className="text-gray-600">Additional forms required by specific states</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* State Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              State-Specific Requirements
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Different states have varying requirements for business name changes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Common State Requirements</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Filed Articles of Amendment with state agency</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Payment of required filing fees ($50-$200)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Board or member resolution approving change</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Certificate of Good Standing (some states)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Name availability verification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Considerations</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Processing times vary by state (1-4 weeks)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Expedited processing available in most states</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Some states require publication in newspapers</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Trademark searches recommended</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Update all business registrations and licenses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Name Change Timeline
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Typical timeframe for business name change process
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Day 1-3: Name Research & Availability</h3>
              </div>
              <p className="text-gray-600 ml-12">
                Comprehensive name search, trademark check, and domain availability verification.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Day 4-7: Document Preparation</h3>
              </div>
              <p className="text-gray-600 ml-12">
                Prepare Articles of Amendment, board resolutions, and all required paperwork.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Day 8-10: State Filing</h3>
              </div>
              <p className="text-gray-600 ml-12">
                File with Secretary of State and pay required fees. Expedited processing available.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Week 2-4: Processing & Approval</h3>
              </div>
              <p className="text-gray-600 ml-12">
                State review and approval process. Receive certified copies of amended documents.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">5</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Week 4-6: Updates & Notifications</h3>
              </div>
              <p className="text-gray-600 ml-12">
                Update IRS, banks, vendors, and all business relationships with new name.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Name Change Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional name change services with transparent pricing
            </p>
          </div>

          <Card className="border-2 border-green-500 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold text-gray-900">$</span>
                  <span className="text-7xl font-bold text-gray-900">299</span>
                </div>
                <p className="text-xl text-gray-600">Complete Name Change Service</p>
                <p className="text-sm text-gray-500 mt-2">+ State filing fees</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Included Services:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Name availability research</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Articles of Amendment preparation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">State filing and processing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Board resolution drafting</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Additional Benefits:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Trademark search included</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Update checklist provided</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Certified copies included</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Expert consultation included</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                style={{
                  backgroundColor: '#34de73',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  padding: '16px 48px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#34de73';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
              >
                Start Name Change Process
              </button>
            </CardContent>
          </Card>
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
              Common questions about business name changes
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does a business name change take?</h3>
              <p className="text-gray-600">The process typically takes 4-6 weeks from start to finish. This includes name research, document preparation, state filing, and approval. Expedited processing is available in most states for an additional fee.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What are the costs involved in changing a business name?</h3>
              <p className="text-gray-600">Our service fee is $299, plus state filing fees which range from $50-$200 depending on your state. Additional costs may include expedited processing fees and certified copies if needed.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need to notify the IRS of my name change?</h3>
              <p className="text-gray-600">Yes, you must notify the IRS using Form 8822-B within 60 days of the name change. You'll also need to update your EIN records and all tax registrations with federal and state agencies.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Will my business credit be affected by the name change?</h3>
              <p className="text-gray-600">Your business credit history will remain intact as long as you properly update all credit accounts and maintain the same EIN. Notify all creditors and credit agencies of the name change promptly.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I change my business name to anything I want?</h3>
              <p className="text-gray-600">The new name must be available, not infringe on existing trademarks, and comply with state naming requirements. Certain words may be restricted and require special approval.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens to my existing contracts after a name change?</h3>
              <p className="text-gray-600">Existing contracts remain valid, but you should notify all parties and consider adding amendments to reflect the new business name. New contracts should use the updated legal name.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Change Your Business Name?
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Let our experts handle your business name change professionally and efficiently. Complete compliance guaranteed.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-white hover:border-green-600"
              style={{
                backgroundColor: '#ffffff',
                color: '#059669',
                fontWeight: 'bold',
                fontSize: '20px',
                padding: '16px 32px',
                borderRadius: '8px',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              Start Name Change
            </button>
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
                  <span>namechange@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <div className="space-y-1">
                <p>Name Change Guide</p>
                <p>State Requirements</p>
                <p>Update Checklist</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}