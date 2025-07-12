import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import businessmanImage from "@assets/ypji1ebiugpwu6my2mxx.png";

// Define inline SVG icons as components
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function Landing() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [typedText, setTypedText] = useState("");
  const [counter, setCounter] = useState(0);
  const fullText = "Business Startups, Done Right!";
  const [, setLocation] = useLocation();

  // Typing animation effect
  useEffect(() => {
    if (counter < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(fullText.slice(0, counter + 1));
        setCounter(counter + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [counter, fullText]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="section-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const { data: subscriptionPlans = [] } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });

  const handleStartBusiness = () => {
    setLocation("/services-marketplace");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {typedText}
                  <span className="inline-block w-1 h-12 bg-green-500 ml-2 animate-pulse"></span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Expert business formation services with AI-powered compliance management. 
                  Get your LLC, Corporation, or other business entity registered fast and stay compliant effortlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    onClick={handleStartBusiness}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2" />
                    Get Started Now
                  </Button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 lg:order-1 mb-12 lg:mb-0">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-green-500 bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <ShieldIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Filing</h3>
                    <p className="text-gray-600 text-sm">Bank-level security for all your business documents</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-green-500 bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <RocketIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Setup</h3>
                    <p className="text-gray-600 text-sm">Get your business registered in as little as 24 hours</p>
                  </div>
                </div>
                <div className="space-y-6 mt-8">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-green-500 bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <UsersIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
                    <p className="text-gray-600 text-sm">Dedicated business formation specialists</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-green-500 bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Guaranteed</h3>
                    <p className="text-gray-600 text-sm">100% accuracy guarantee or your money back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="section-why-choose" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ParaFort?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make business formation simple, fast, and affordable with our comprehensive suite of services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Professional legal experts guide you through every step of the formation process</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600">Get your business registered quickly with our streamlined process</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support to help you with any questions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All 50 States</h3>
              <p className="text-gray-600">We can help you form your business in any state across the United States</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Formation Types */}
      <section id="section-formation-types" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Business Structure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the right business entity type for your needs. Each structure offers different benefits and protections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-green-500">
              <CardHeader className="text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🏢</span>
                </div>
                <CardTitle className="text-2xl">LLC Formation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Limited personal liability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Flexible tax options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Simple management structure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-green-500">
              <CardHeader className="text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">💼</span>
                </div>
                <CardTitle className="text-2xl">Corporation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Maximum liability protection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Easier to raise capital</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Perpetual existence</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-green-500">
              <CardHeader className="text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">📊</span>
                </div>
                <CardTitle className="text-2xl">S-Corporation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Pass-through taxation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Self-employment tax savings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Enhanced credibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Business?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully launched their businesses with ParaFort
          </p>
          <Button
            onClick={handleStartBusiness}
            className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center text-lg"
          >
            Start Your Business Today
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}