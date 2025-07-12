import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Building, 
  Clock, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  FileText, 
  Briefcase, 
  UserCheck, 
  Scale, 
  DollarSign, 
  File, 
  Home, 
  Mail, 
  Calculator, 
  Receipt, 
  CreditCard, 
  Star, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Calendar, 
  FileCheck 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
const businessmanImage = "/business-analytics-hero.jpg";
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  buttonHover, 
  cardHover, 
  staggerChildren, 
  counterAnimation,
  useScrollReveal 
} from "@/lib/animations";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { SEO, structuredDataTemplates } from "@/components/SEO";

export default function Landing() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [typedText, setTypedText] = useState("");
  const [counter, setCounter] = useState(0);
  const fullText = "Business Startups, Done Right!";
  const [, setLocation] = useLocation();

  // SEO structured data for landing page
  const landingFaqData = [
    {
      question: "How long does it take to form an LLC?",
      answer: "LLC formation typically takes 1-3 business days with our expedited service, though standard processing can take 1-2 weeks depending on your state."
    },
    {
      question: "What documents do I need to start a business?",
      answer: "You'll need to choose a business name, provide a registered agent address, and file Articles of Organization or Incorporation with your state. We handle all the paperwork for you."
    },
    {
      question: "Do I need a registered agent?",
      answer: "Yes, most states require businesses to have a registered agent to receive legal documents. ParaFort provides registered agent services in all 50 states."
    },
    {
      question: "What's included in your business formation package?",
      answer: "Our packages include state filing fees, registered agent service for one year, Articles of Organization/Incorporation, Operating Agreement or Bylaws, and ongoing compliance monitoring."
    }
  ];

  const landingHowToSteps = [
    "Choose your business entity type (LLC, Corporation, etc.)",
    "Select your business name and check availability", 
    "Provide required business information",
    "Choose your registered agent service",
    "Review and submit your application",
    "Receive your filed documents and EIN"
  ];

  const landingBreadcrumbData = [
    { name: "Home", url: "https://parafort.com/" }
  ];

  // Fetch subscription plans from database
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
    retry: false,
  });

  // Optimized typing animation effect
  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout;
    
    const typeText = () => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
        if (index <= fullText.length) {
          timer = setTimeout(typeText, 80);
        }
      }
    };
    
    typeText();
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [fullText]);

  // Optimized counter animation
  useEffect(() => {
    let current = 0;
    let timer: NodeJS.Timeout;
    
    const incrementCounter = () => {
      if (current < 50000) {
        current += 1000;
        setCounter(current);
        timer = setTimeout(incrementCounter, 50);
      }
    };
    
    incrementCounter();
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  const handleStartBusiness = () => {
    setLocation("/formation-workflow");
  };



  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="ParaFort - Business Formation & Compliance Services | Start Your LLC Today"
        description="Expert business formation services with AI-powered compliance management. Get your LLC, Corporation registered fast and stay compliant effortlessly in all 50 states. Starting at $149 + state fees."
        keywords="LLC formation, business registration, corporation setup, business compliance, EIN application, registered agent, annual reports, business formation services, start LLC online, incorporate business"
        canonicalUrl="https://parafort.com/"
        structuredData={[
          structuredDataTemplates.faq(landingFaqData),
          structuredDataTemplates.howTo(
            "How to Start Your Business with ParaFort",
            landingHowToSteps,
            "Complete guide to forming your business entity with professional support and compliance management."
          ),
          structuredDataTemplates.breadcrumb(landingBreadcrumbData),
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ParaFort",
            "url": "https://parafort.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://parafort.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />

      <AnnouncementBanner />
      
      {/* Hero Section - Complete */}
      <motion.section 
        className="bg-white pb-20 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <motion.div 
              className="lg:col-span-6 lg:text-left text-center"
              {...fadeInLeft}
            >
              <motion.h1 
                className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="block text-green-500"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Business Startups,
                </motion.span>
                <motion.span 
                  className="block"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Done Right!
                </motion.span>
                <motion.div 
                  className="flex items-baseline justify-center lg:justify-start mt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <span className="text-6xl font-bold text-gray-900">$</span>
                  <motion.span 
                    className="text-8xl font-bold text-gray-900"
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    0
                  </motion.span>
                  <span className="text-sm text-green-500 ml-2">plus State fee</span>
                </motion.div>
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Create your business with ParaFort, we streamline every step of launching, managing, and expanding your company.
              </motion.p>
              
              {/* Promotional Banner - Before buttons */}
              <motion.div 
                className="mt-8 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <AnnouncementBanner location="landing" />
              </motion.div>
              
              <motion.div 
                className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                  <motion.span
                    onClick={handleStartBusiness}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 min-h-[60px] w-full sm:w-auto border-0 transition-all duration-200 btn-animated flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: '#ffffff' }}
                    >
                      <path 
                        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.5 9.5a22 22 0 0 1-3.5 2l-3-3zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                      Start Your LLC Today
                    </span>
                  </motion.span>
                  
                  <motion.span
                    onClick={() => window.location.href = '/business-name-generator'}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 min-h-[60px] w-full sm:w-auto border-0 transition-all duration-200 btn-animated flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#f97316',
                      color: '#ffffff',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: '#ffffff' }}
                    >
                      <path 
                        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3L13 5L11 7V9L10 11V14H8V16H10V22H14V16H16V14H14V11L21 9ZM7 12C8.1 12 9 12.9 9 14S8.1 16 7 16S5 15.1 5 14S5.9 12 7 12ZM3 20C4.1 20 5 20.9 5 22S4.1 24 3 24S1 23.1 1 22S1.9 20 3 20Z" 
                        fill="currentColor"
                      />
                    </svg>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                      Generate Your Business Name
                    </span>
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="lg:col-span-6 mt-12 lg:mt-0"
              {...fadeInRight}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <motion.img 
                  src={businessmanImage} 
                  alt="Professional businessman with financial data overlay showing business success metrics"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    y: -8,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                  }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                />
                {/* Floating animation elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Best in Value
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Entity Tools Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entity Comparison Tool Card */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => window.location.href = '/entity-comparison'}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Entity Comparison Tool
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Quick quiz to determine the best structure for your business
                  </p>
                </div>
                <div className="ml-4">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path 
                      d="M9 18L15 12L9 6" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* State Entity Requirements Card */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => window.location.href = '/entity-requirements'}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    State Entity Requirements
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your essential resource for forming and managing companies
                  </p>
                </div>
                <div className="ml-4">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path 
                      d="M9 18L15 12L9 6" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
                  Strategize, Launch, and <span className="text-green-500">Expand
                  Your Business</span> with ParaFort
                </h2>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  Your visionary idea deserves exceptional execution, and with the right strategy, it can come to life. ParaFort helps you transform your concept into a thriving business by providing the tools and support needed to plan, launch, and scale successfully, ensuring you achieve your entrepreneurial goals with confidence.
                </p>
                <div className="mt-8">
                  <button
                    onClick={handleStartBusiness}
                    style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#16a34a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#22c55e';
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 lg:order-1 mb-12 lg:mb-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mt-3">Secure & Compliant</h4>
                      <p className="text-sm text-gray-600 mt-1">Bank-level security</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mt-3">Fast Setup</h4>
                      <p className="text-sm text-gray-600 mt-1">Launch in minutes</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mt-3">Expert Support</h4>
                      <p className="text-sm text-gray-600 mt-1">24/7 assistance</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 mt-3">Guaranteed</h4>
                      <p className="text-sm text-gray-600 mt-1">100% satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ParaFort Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose ParaFort?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We provide comprehensive business formation services with unmatched expertise
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

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Trusted by Thousands of Entrepreneurs
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">50,000+</div>
              <div className="text-gray-600">Businesses Formed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">50</div>
              <div className="text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Choose Your Business Type
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We help you form the right business structure for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">LLC Formation</h3>
                <p className="text-gray-600 mb-6">Limited Liability Company - Perfect for small businesses and startups</p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Personal asset protection
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Tax flexibility
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Simple management structure
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6.5l-4 3.5-4-3.5V6M12 11h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Corporation</h3>
                <p className="text-gray-600 mb-6">C-Corporation - Ideal for larger businesses seeking investment</p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Unlimited growth potential
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Easy to raise capital
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Perpetual existence
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">S-Corporation</h3>
                <p className="text-gray-600 mb-6">S-Corp Election - Tax advantages for qualifying businesses</p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Pass-through taxation
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Self-employment tax savings
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Corporate structure benefits
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-6xl font-bold text-green-500 mb-4">
              Start with $0
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Choose Your Business Formation Plan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive business formation services with ongoing support and compliance
            </p>
          </div>
          
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Array.isArray(subscriptionPlans) && subscriptionPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan: any, index: number) => {
                const isPopular = index === 1; // Mark middle plan as popular
                return (
                  <Card key={plan.id} className={`relative transition-all duration-200 hover:shadow-lg flex flex-col ${
                    isPopular ? 'border-green-500 border-2 scale-105' : 'border-gray-200'
                  }`}>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-semibold">
                          MOST POPULAR
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </CardTitle>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-green-500">
                          ${parseFloat(plan.yearlyPrice).toFixed(0)}
                        </span>
                        <span className="text-gray-600 ml-2">+ state fees</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {plan.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="p-6 pt-0 flex flex-col h-full">
                      <ul className="space-y-3 mb-8 flex-grow">
                        {plan.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-auto">
                        <button 
                          onClick={handleStartBusiness}
                          style={{
                            width: '100%',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'background-color 0.2s',
                            display: 'block',
                            visibility: 'visible',
                            opacity: 1
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#16a34a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#22c55e';
                          }}
                        >
                          Get Started
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No subscription plans available at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real stories from entrepreneurs who chose ParaFort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "ParaFort made starting my LLC incredibly simple. The process was fast and the support team was always available to help."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-gray-600">Tech Startup Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Professional service at an affordable price. I recommend ParaFort to any entrepreneur looking to start their business."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                    <p className="text-gray-600">Restaurant Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The ongoing compliance support has been invaluable. ParaFort keeps my business on track with all requirements."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Lisa Rodriguez</h4>
                    <p className="text-gray-600">Consulting Firm Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Resources & Tools
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to start and grow your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Business Guides</h3>
                <p className="text-gray-600 text-sm">Comprehensive guides for starting your business</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Compliance Calendar</h3>
                <p className="text-gray-600 text-sm">Track important filing deadlines and requirements</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileCheck className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Document Templates</h3>
                <p className="text-gray-600 text-sm">Professional business document templates</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Business Name Generator</h3>
                <p className="text-gray-600 text-sm">Find the perfect name for your business</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Key Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
                  Key Steps to Start Your Business
                </h2>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  We offer comprehensive business formation services designed to make the process of starting your business smooth and hassle-free. Whether you're launching a small startup or planning to scale, we provide expert guidance on choosing the right business structure, registering your business, and ensuring you meet all legal and regulatory requirements.
                </p>
                <div className="mt-8">
                  <button
                    onClick={handleStartBusiness}
                    style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#16a34a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#22c55e';
                    }}
                  >
                    Get Started Today
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500 text-white font-bold text-lg">
                      01
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Choose a Business Structure</h3>
                    <p className="mt-2 text-gray-600">
                      Decide on a business structure (e.g., sole proprietorship, partnership, LLC, corporation) based on factors like liability, taxes, and control.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500 text-white font-bold text-lg">
                      02
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Register Your Business Name</h3>
                    <p className="mt-2 text-gray-600">
                      Choose and register a unique business name that complies with state regulations and reflects your brand identity.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500 text-white font-bold text-lg">
                      03
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Obtain Required Licenses</h3>
                    <p className="mt-2 text-gray-600">
                      Get the necessary business licenses and permits required for your industry and location to operate legally.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500 text-white font-bold text-lg">
                      04
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Set Up Business Operations</h3>
                    <p className="mt-2 text-gray-600">
                      Establish your business bank account, accounting system, and operational processes to ensure smooth daily operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
              Our Comprehensive Business Services
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              From formation to ongoing compliance, we provide everything your business needs to succeed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Business Management */}
            <Link href="/business-management">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6.5l-4 3.5-4-3.5V6M12 11h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Business Management</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Effective business management improves efficiency, boosts profits, enhances decision-making, and fosters growth.
                  </p>
                  <div className="flex items-center text-green-500 font-semibold hover:text-[#1a5f33] transition-colors cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Business Formation */}
            <Link href="/business-formation-service">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Business Formation</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Business formation with ParaFort ensures fast, hassle-free setup, legal protection, and compliance.
                  </p>
                  <div className="button-parafort flex items-center text-green-500 font-semibold hover:text-[#1a5f33] cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Registered Agent */}
            <Link href="/registered-agent">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Registered Agent</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    A registered agent with ParaFort ensures privacy, compliance, and timely document handling.
                  </p>
                  <div className="button-parafort flex items-center text-green-500 font-semibold hover:text-[#1a5f33] cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Fictitious Business Name */}
            <Link href="/fictitious-business-services">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Fictitious Business Name</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ParaFort's Fictitious Business Name service ensures legal compliance and enhances business credibility.
                  </p>
                  <div className="button-parafort flex items-center text-green-500 font-semibold hover:text-[#1a5f33] cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* SOI Filing */}
            <Link href="/soi-filing">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h6l2 2h6a2 2 0 012 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">SOI Filing</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our SOI (Statement of Information) Filing Service ensures timely compliance, reducing risks and maintaining good standing.
                  </p>
                  <div className="button-parafort flex items-center text-green-500 font-semibold hover:text-[#1a5f33] cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Operating Agreements */}
            <Link href="/operating-agreements">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Operating Agreements</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ParaFort's Operating Agreements service ensures clear terms, legal protection, and business clarity.
                  </p>
                  <div className="button-parafort flex items-center text-green-500 font-semibold hover:text-[#1a5f33] cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Power of Attorney */}
            <Link href="/power-of-attorney">
              <Card className="service-card-animated card-business-interactive border-l-4 border-l-[#27884b] group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Power of Attorney</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our Power of Attorney service provides legal authority, protection, and ensures smooth decision-making.
                  </p>
                  <div className="button-parafort flex items-center text-green-500 font-semibold hover:text-[#1a5f33] cursor-pointer">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Residential Lease */}
            <Link href="/residential-lease">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#27884b] group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Residential Lease</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Residential Lease service ensures clear terms, legal protection, and smooth tenant-landlord relations.
                  </p>
                  <span className="flex items-center text-green-500 font-semibold hover:text-[#1a5f33] transition-colors cursor-pointer check-out-more">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Digital Mailbox Services */}
            <Link href="/digital-mailbox">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#27884b] group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Digital Mailbox Services</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ParaFort's Digital Mailbox service offers secure, convenient mail management and easy access online.
                  </p>
                  <span className="flex items-center text-green-500 font-semibold hover:text-[#1a5f33] transition-colors cursor-pointer check-out-more">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Accounting Services */}
            <Link href="/accounting-services">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#27884b] group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Accounting Services</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ParaFort offers Accounting services to ensure accurate financial tracking, tax compliance, and business growth support.
                  </p>
                  <span className="flex items-center text-green-500 font-semibold hover:text-[#1a5f33] transition-colors cursor-pointer check-out-more">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Tax Filing Services */}
            <Link href="/tax-filing-services">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#27884b] group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Tax Filing Services</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ParaFort CPA's Tax Filing services ensure accurate filings, maximize deductions, and ensure compliance.
                  </p>
                  <span className="flex items-center text-green-500 font-semibold hover:text-[#1a5f33] transition-colors cursor-pointer check-out-more">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Payroll Services */}
            <Link href="/business-payroll-services">
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#27884b] group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Payroll Services</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Payroll services ensure accurate, timely employee payments, tax compliance, and business efficiency.
                  </p>
                  <span className="flex items-center text-green-500 font-semibold hover:text-[#1a5f33] transition-colors cursor-pointer check-out-more">
                    Check out more <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </CardContent>
              </Card>
            </Link>
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
              Get answers to common questions about business formation
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does it take to form my business?</h3>
              <p className="text-gray-600">Most business formations are completed within 1-5 business days, depending on the state and type of entity. We offer expedited processing for faster turnaround times.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you provide a registered agent service?</h3>
              <p className="text-gray-600">Yes, we provide registered agent services in all 50 states. This service ensures you receive important legal documents and maintain compliance with state requirements.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's included in the formation package?</h3>
              <p className="text-gray-600">Our packages include state filing, articles of incorporation/organization, federal EIN, operating agreement (for LLCs), and ongoing compliance support.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I change my business structure later?</h3>
              <p className="text-gray-600">Yes, business structures can be changed, though the process varies by state and structure type. We can help you evaluate and execute any necessary changes.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you offer ongoing compliance support?</h3>
              <p className="text-gray-600">Absolutely! We provide ongoing compliance monitoring, annual report filing, and reminder services to keep your business in good standing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your Business Journey?
          </h2>
          <p className="mt-6 text-xl text-white opacity-90">
            Join thousands of entrepreneurs who chose ParaFort to launch their businesses successfully.
          </p>
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleGetStarted}
              style={{
                backgroundColor: '#34de73',
                color: 'white',
                fontWeight: '600',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2bc866';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#34de73';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              Start Your LLC Today
            </button>
          </div>
        </div>
      </section>

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
