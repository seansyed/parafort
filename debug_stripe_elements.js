// Debug script to analyze Stripe Elements loading issue
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function analyzeStripeElementsIssue() {
  const prompt = `
I'm debugging a Stripe Elements integration issue in a React checkout page. Here are the symptoms and code details:

SYMPTOMS:
- Payment button shows "Loading..." indefinitely 
- Console logs show: stripe: false, elements: false, isReady: false
- Warning: "Unsupported prop change on Elements: You cannot change the stripe prop after setting it"
- Payment intent creation works correctly (clientSecret received)
- Business entity lookup works correctly

CODE STRUCTURE:
\`\`\`javascript
// Load Stripe outside component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

// Checkout component structure
const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  
  useEffect(() => {
    // Creates payment intent successfully
    apiRequest("POST", "/api/create-payment-intent", { ... })
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm service={service} businessId={businessId} plan={plan} />
        </Elements>
      ) : (
        <div>Setting up payment form...</div>
      )}
    </div>
  );
};

// CheckoutForm component
const CheckoutForm = ({ service, businessId, plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("Payment ready state check:", { stripe: !!stripe, elements: !!elements, isReady });
    if (stripe && elements) {
      setIsReady(true);
      console.log("Payment button should now be ready");
    }
  }, [stripe, elements, isReady]);

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!isReady || isProcessing}>
        {isProcessing ? "Processing..." : "Complete Payment"}
      </button>
    </form>
  );
};
\`\`\`

ENVIRONMENT:
- React with Vite
- @stripe/stripe-js and @stripe/react-stripe-js packages
- VITE_STRIPE_PUBLIC_KEY is correctly set
- Running in development mode

ANALYSIS NEEDED:
1. Why are stripe and elements hooks returning false/null?
2. Why is the "stripe prop change" warning appearing?
3. What's the correct pattern for conditional Stripe Elements rendering?
4. How to ensure Elements initialize properly with dynamic clientSecret?

Please provide a comprehensive solution that addresses the root cause and ensures the payment form loads correctly.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysis = response.text();
    
    console.log("=== GEMINI ANALYSIS: STRIPE ELEMENTS ISSUE ===");
    console.log(analysis);
    console.log("=== END ANALYSIS ===");
    
    return analysis;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

analyzeStripeElementsIssue().catch(console.error);