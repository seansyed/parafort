import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Subscription Plans API
app.get('/api/subscription-plans', async (req, res) => {
  try {
    // Hardcoded subscription plans for development
    const plans = [
      {
        id: 1,
        name: 'Free',
        description: 'Perfect for new entrepreneurs starting their business at no cost with our Free Plan. Get essential business formation support, including company registration and basic compliance support, along with access to our knowledge base and community forums.',
        yearlyPrice: 0,
        features: ['Business Formation Filing', 'Email Support'],
        isActive: true
      },
      {
        id: 2,
        name: 'Silver',
        description: 'Get more than the basics with our Silver Plan. Along with essential business formation services, this plan ensures your company is set up with ongoing compliance support. Perfect for growing businesses, this plan ensures your foundation and ongoing compliance support.',
        yearlyPrice: 195,
        features: ['Everything in Starter', 'Registered Agent Service (1 year)', 'Digital Mailbox', 'Business Bank Account Setup', 'Compliance Calendar', 'Priority Support'],
        isActive: true
      },
      {
        id: 3,
        name: 'Gold',
        description: 'Upgrade to our Gold plan for a comprehensive business formation experience. Ideal for entrepreneurs who want premium features and expert support as they launch and grow their business.',
        yearlyPrice: 295,
        features: ['Everything in Professional', 'Dedicated Account Manager', 'Custom Legal Documents', 'Tax Strategy Consultation', 'Multi-state Compliance', '24/7 Phone Support'],
        isActive: true
      }
    ];
    res.json(plans);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch subscription plans' });
  }
});

// Public Plans API (alias for subscription plans)
app.get('/api/plans', async (req, res) => {
  try {
    // Hardcoded subscription plans for development
    const plans = [
      {
        id: 1,
        name: 'Free',
        description: 'Perfect for new entrepreneurs starting their business at no cost with our Free Plan. Get essential business formation support, including company registration and basic compliance support, along with access to our knowledge base and community forums.',
        yearlyPrice: 0,
        features: ['Business Formation Filing', 'Email Support'],
        isActive: true
      },
      {
        id: 2,
        name: 'Silver',
        description: 'Get more than the basics with our Silver Plan. Along with essential business formation services, this plan ensures your company is set up with ongoing compliance support. Perfect for growing businesses, this plan ensures your foundation and ongoing compliance support.',
        yearlyPrice: 195,
        features: ['Everything in Starter', 'Registered Agent Service (1 year)', 'Digital Mailbox', 'Business Bank Account Setup', 'Compliance Calendar', 'Priority Support'],
        isActive: true
      },
      {
        id: 3,
        name: 'Gold',
        description: 'Upgrade to our Gold plan for a comprehensive business formation experience. Ideal for entrepreneurs who want premium features and expert support as they launch and grow their business.',
        yearlyPrice: 295,
        features: ['Everything in Professional', 'Dedicated Account Manager', 'Custom Legal Documents', 'Tax Strategy Consultation', 'Multi-state Compliance', '24/7 Phone Support'],
        isActive: true
      }
    ];
    res.json(plans);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
});

// Services with plans API
app.get('/api/services-with-plans', async (req, res) => {
  try {
    const category = req.query.category;
    // Mock services data
    const services = [
      {
        id: 1,
        name: 'LLC Formation',
        description: 'Form your Limited Liability Company',
        category: 'Formation',
        basePrice: 99,
        plans: [
          { id: 1, name: 'Basic', price: 99 },
          { id: 2, name: 'Standard', price: 199 },
          { id: 3, name: 'Premium', price: 299 }
        ]
      },
      {
        id: 2,
        name: 'Corporation Formation',
        description: 'Form your Corporation',
        category: 'Formation',
        basePrice: 149,
        plans: [
          { id: 1, name: 'Basic', price: 149 },
          { id: 2, name: 'Standard', price: 249 },
          { id: 3, name: 'Premium', price: 349 }
        ]
      },
      {
        id: 11,
        name: 'BOIR Filing',
        description: 'Beneficial Ownership Information Report filing service',
        category: 'Compliance',
        basePrice: 199,
        plans: [
          { id: 1, name: 'Basic', price: 199 },
          { id: 2, name: 'Standard', price: 299 },
          { id: 3, name: 'Premium', price: 399 }
        ]
      }
    ];
    
    const filteredServices = category ? services.filter(s => s.category === category) : services;
    res.json(filteredServices);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// All services API
app.get('/api/services/all', async (req, res) => {
  try {
    // Mock services data - all available services
    const services = [
      {
        id: 1,
        name: 'LLC Formation',
        description: 'Form your Limited Liability Company',
        category: 'Formation',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: 'Corporation Formation',
        description: 'Form your Corporation',
        category: 'Formation',
        oneTimePrice: '149.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 2
      },
      {
        id: 3,
        name: 'Tax Filing Services',
        description: 'Professional tax filing and preparation services',
        category: 'Tax',
        oneTimePrice: '299.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 3
      },
      {
        id: 5,
        name: 'Annual Report Filing',
        description: 'Annual report filing service for your business',
        category: 'Compliance',
        oneTimePrice: '149.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 4
      },
      {
        id: 8,
        name: 'Business License Services',
        description: 'Obtain required business licenses and permits',
        category: 'Licensing',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 5
      },
      {
        id: 9,
        name: 'Legal Documents Service',
        description: 'Custom legal document preparation and filing',
        category: 'Legal',
        oneTimePrice: '249.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 6
      },
      {
        id: 10,
        name: 'S-Corporation Election',
        description: 'File S-Corporation tax election with the IRS',
        category: 'Tax',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 7
      },
      {
        id: 11,
        name: 'BOIR Filing',
        description: 'Beneficial Ownership Information Report filing service',
        category: 'Compliance',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true,
        sortOrder: 8
      },
      {
        id: 15,
        name: 'Business Legal Name Change',
        description: 'Change your business legal name officially',
        category: 'Legal',
        oneTimePrice: '299.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 9
      },
      {
        id: 17,
        name: 'EIN Service',
        description: 'Obtain your Federal Employer Identification Number',
        category: 'Tax',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true,
        sortOrder: 10
      },
      {
        id: 21,
        name: 'Business Dissolution',
        description: 'Dissolve your business entity properly',
        category: 'Legal',
        oneTimePrice: '399.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 11
      },
      {
        id: 22,
        name: 'Business Dissolution Premium',
        description: 'Premium business dissolution with additional services',
        category: 'Legal',
        oneTimePrice: '599.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 12
      },
      {
        id: 30,
        name: 'Registered Agent Service',
        description: 'Professional registered agent service for your business',
        category: 'Compliance',
        oneTimePrice: '99.00',
        recurringPrice: '99.00',
        recurringInterval: 'yearly',
        isActive: true,
        isPopular: true,
        sortOrder: 13
      }
    ];
    
    res.json(services);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Individual service API
app.get('/api/services/:id', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    
    // Mock services data - same as services-with-plans but formatted for individual service
    const services = {
      1: {
        id: 1,
        name: 'LLC Formation',
        description: 'Form your Limited Liability Company',
        category: 'Formation',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true
      },
      2: {
        id: 2,
        name: 'Corporation Formation',
        description: 'Form your Corporation',
        category: 'Formation',
        oneTimePrice: '149.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      3: {
        id: 3,
        name: 'Tax Filing Services',
        description: 'Professional tax filing and preparation services',
        category: 'Tax',
        oneTimePrice: '299.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      5: {
        id: 5,
        name: 'Annual Report Filing',
        description: 'Annual report filing service for your business',
        category: 'Compliance',
        oneTimePrice: '149.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      8: {
        id: 8,
        name: 'Business License Services',
        description: 'Obtain required business licenses and permits',
        category: 'Licensing',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      9: {
        id: 9,
        name: 'Legal Documents Service',
        description: 'Custom legal document preparation and filing',
        category: 'Legal',
        oneTimePrice: '249.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      10: {
        id: 10,
        name: 'S-Corporation Election',
        description: 'File S-Corporation tax election with the IRS',
        category: 'Tax',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      11: {
        id: 11,
        name: 'BOIR Filing',
        description: 'Beneficial Ownership Information Report filing service',
        category: 'Compliance',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true
      },
      15: {
        id: 15,
        name: 'Business Legal Name Change',
        description: 'Change your business legal name officially',
        category: 'Legal',
        oneTimePrice: '299.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      17: {
        id: 17,
        name: 'EIN Service',
        description: 'Obtain your Federal Employer Identification Number',
        category: 'Tax',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true
      },
      21: {
        id: 21,
        name: 'Business Dissolution',
        description: 'Dissolve your business entity properly',
        category: 'Legal',
        oneTimePrice: '399.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      22: {
        id: 22,
        name: 'Business Dissolution Premium',
        description: 'Premium business dissolution with additional services',
        category: 'Legal',
        oneTimePrice: '599.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false
      },
      30: {
        id: 30,
        name: 'Registered Agent Service',
        description: 'Professional registered agent service for your business',
        category: 'Compliance',
        oneTimePrice: '99.00',
        recurringPrice: '99.00',
        recurringInterval: 'yearly',
        isActive: true,
        isPopular: true
      }
    };
    
    const service = services[serviceId];
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// Auth check email API
app.post('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    // Mock response - always return that email doesn't exist
    res.json({ exists: false });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to check email' });
  }
});

// Check email API (alias for formation workflow)
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Checking email:', email);
    // Mock response - always return that email doesn't exist
    res.json({ exists: false });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to check email' });
  }
});

// User step progress API
app.post('/api/user-step-progress', async (req, res) => {
  try {
    const { step, data } = req.body;
    console.log('Saving step progress:', { step, data });
    // Mock successful save
    res.json({ success: true, message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to save progress' });
  }
});

// Business Entities API
app.get('/api/business-entities', async (req, res) => {
  try {
    console.log('Fetching business entities');
    // Mock business entities data
    res.json([]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch business entities' });
  }
});

app.post('/api/business-entities', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Creating business entity:', formData);
    // Mock successful creation with generated ID
    const mockEntity = {
      id: Math.floor(Math.random() * 10000) + 1,
      ...formData,
      createdAt: new Date().toISOString()
    };
    res.json({ data: mockEntity, success: true, message: 'Business entity created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to create business entity' });
  }
});

app.put('/api/business-entities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;
    console.log('Updating business entity:', id, formData);
    // Mock successful update
    const mockEntity = {
      id: parseInt(id),
      ...formData,
      updatedAt: new Date().toISOString()
    };
    res.json({ data: mockEntity, success: true, message: 'Business entity updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to update business entity' });
  }
});

// Send verification email API
app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Sending verification email to:', email);
    
    // Generate verification code and ID
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationId = 'verification_' + Math.random().toString(36).substr(2, 9);
    
    // Store verification code with expiration (15 minutes)
     const expiresAt = Date.now() + (15 * 60 * 1000);
     verificationCodes.set(verificationId, {
       code: verificationCode,
       email: email,
       expiresAt: expiresAt
     });
     
     // Clean up expired codes
     for (const [id, data] of verificationCodes.entries()) {
       if (data.expiresAt < Date.now()) {
         verificationCodes.delete(id);
       }
     }
     
     // Check if email credentials are configured
     if (!process.env.OUTLOOK_FROM_EMAIL || !process.env.OUTLOOK_SMTP_PASSWORD || 
         process.env.OUTLOOK_FROM_EMAIL === 'your-email@outlook.com') {
       console.log('⚠️  Email credentials not configured. Running in simulation mode.');
       console.log(`📧 SIMULATION: Would send verification code ${verificationCode} to ${email}`);
       console.log(`🔑 Use verification code: ${verificationCode}`);
       console.log('💡 To enable real emails, update OUTLOOK_FROM_EMAIL and OUTLOOK_SMTP_PASSWORD in .env file');
       
       res.json({ 
         success: true, 
         message: 'Verification email sent successfully (simulation mode)',
         verificationId: verificationId,
         simulationMode: true,
         simulationCode: verificationCode
       });
       return;
     }
    
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_FROM_EMAIL,
        pass: process.env.OUTLOOK_SMTP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });
    
    // Email content
    const mailOptions = {
      from: process.env.OUTLOOK_FROM_EMAIL,
      to: email,
      subject: 'ParaFort Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #34de73; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">ParaFort Verification</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Your Verification Code</h2>
            <p style="color: #666; font-size: 16px;">Please use the following verification code to complete your email verification:</p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #34de73; font-size: 32px; margin: 0; letter-spacing: 4px;">${verificationCode}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
    
    res.json({ 
      success: true, 
      message: 'Verification email sent successfully',
      verificationId: verificationId
    });
    
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    res.status(500).json({ 
      message: 'Failed to send verification email',
      error: error.message 
    });
  }
});

// Send verification SMS API
app.post('/api/send-verification-sms', async (req, res) => {
  try {
    const { phone } = req.body;
    console.log('Sending verification SMS to:', phone);
    // Mock successful SMS send with verification ID
    const verificationId = 'mock_verification_' + Math.random().toString(36).substr(2, 9);
    res.json({ 
      success: true, 
      message: 'Verification SMS sent successfully',
      verificationId: verificationId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send verification SMS' });
  }
});

// Store verification codes in memory (in production, use a database)
const verificationCodes = new Map();

// Verify code API
app.post('/api/verify-code', async (req, res) => {
  try {
    const { verificationId, code } = req.body;
    console.log('Verifying code:', { verificationId, code });
    
    // Check if code exists and is valid
    const storedData = verificationCodes.get(verificationId);
    
    if (!storedData) {
      return res.json({ 
        success: false, 
        verified: false,
        message: 'Invalid verification ID or code has expired.'
      });
    }
    
    // Check if code matches
    if (storedData.code === code) {
      // Remove the used code
      verificationCodes.delete(verificationId);
      
      res.json({ 
        success: true, 
        verified: true,
        message: 'Code verified successfully'
      });
    } else {
      res.json({ 
        success: false, 
        verified: false,
        message: 'Invalid verification code. Please check your email and try again.'
      });
    }
    
  } catch (error) {
    console.error('❌ Error verifying code:', error);
    res.status(500).json({ 
      message: 'Failed to verify code',
      error: error.message 
    });
  }
});

// Stripe configuration API
app.get('/api/stripe/config', (req, res) => {
  try {
    const stripePublicKey = process.env.VITE_STRIPE_PUBLIC_KEY;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    // Check if Stripe is configured
    if (!stripePublicKey || !stripeSecretKey || 
        stripePublicKey === 'pk_test_your_stripe_public_key_here' ||
        stripeSecretKey === 'sk_test_your_stripe_secret_key_here') {
      console.log('⚠️  Stripe credentials not configured. Running in simulation mode.');
      res.json({
        requiresConfiguration: true,
        error: true,
        message: 'Stripe configuration required',
        publishableKey: 'pk_test_simulation_mode',
        environment: 'simulation'
      });
      return;
    }
    
    res.json({
      publishableKey: stripePublicKey,
      environment: stripePublicKey.includes('test') ? 'test' : 'live'
    });
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    res.status(500).json({ error: 'Failed to get Stripe configuration' });
  }
});

// Create payment intent API
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    console.log('Creating payment intent:', { amount, currency, metadata });
    
    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key_here') {
      console.log('⚠️  Stripe not configured. Creating mock payment intent.');
      
      // Generate mock client secret
      const mockPaymentIntentId = 'pi_mock_' + Math.random().toString(36).substr(2, 24);
      const mockClientSecret = mockPaymentIntentId + '_secret_' + Math.random().toString(36).substr(2, 16);
      
      console.log(`💳 SIMULATION: Mock payment intent created for $${(amount / 100).toFixed(2)}`);
      console.log(`🔑 Mock Payment Intent ID: ${mockPaymentIntentId}`);
      
      res.json({
        success: true,
        clientSecret: mockClientSecret,
        paymentIntentId: mockPaymentIntentId,
        amount: amount,
        currency: currency,
        simulationMode: true
      });
      return;
    }
    
    // In a real implementation, you would use the Stripe SDK here
    // For now, return a mock response
    const mockPaymentIntentId = 'pi_test_' + Math.random().toString(36).substr(2, 24);
    const mockClientSecret = mockPaymentIntentId + '_secret_' + Math.random().toString(36).substr(2, 16);
    
    res.json({
      success: true,
      clientSecret: mockClientSecret,
      paymentIntentId: mockPaymentIntentId,
      amount: amount,
      currency: currency
    });
    
  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: error.message 
    });
  }
});

// Formation order API
app.get('/api/formation-order/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    console.log('Fetching formation order for payment intent:', paymentIntentId);
    
    // Mock order data
    const mockOrder = {
      id: 'order_' + Math.random().toString(36).substr(2, 9),
      paymentIntentId: paymentIntentId,
      status: 'completed',
      amount: 31500, // $315.00
      currency: 'usd',
      businessName: 'Test Business',
      entityType: 'LLC',
      state: 'CA',
      createdAt: new Date().toISOString(),
      items: [
        {
          description: 'Gold Plan (Annual)',
          amount: 29500
        },
        {
          description: 'State Filing Fee (CA)',
          amount: 2000
        }
      ]
    };
    
    res.json({
      success: true,
      order: mockOrder
    });
    
  } catch (error) {
    console.error('❌ Error fetching formation order:', error);
    res.status(500).json({ 
      message: 'Failed to fetch formation order',
      error: error.message 
    });
  }
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
});