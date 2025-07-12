import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    setSessionId(session);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your payroll service subscription has been activated and you'll receive a confirmation email shortly.
          </p>
          
          {sessionId && (
            <p className="text-sm text-gray-500 mb-6">
              Transaction ID: {sessionId.slice(-8)}
            </p>
          )}
          
          <div className="space-y-3">
            <Link href="/payroll-purchase">
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Make Another Purchase
              </button>
            </Link>
            
            <Link href="/">
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Return to Homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}