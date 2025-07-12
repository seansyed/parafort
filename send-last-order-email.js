const { config } = require('dotenv');
const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { formationOrders } = require('./shared/schema');
const { desc } = require('drizzle-orm');
const { emailService } = require('./server/emailService');

config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function sendLastOrderEmails() {
  try {
    console.log('Fetching the most recent formation order...');
    
    // Get the most recent order
    const [lastOrder] = await db
      .select()
      .from(formationOrders)
      .orderBy(desc(formationOrders.createdAt))
      .limit(1);
    
    if (!lastOrder) {
      console.log('No orders found in the database.');
      return;
    }
    
    console.log('Found order:', {
      orderId: lastOrder.orderId,
      businessName: lastOrder.businessName,
      customerEmail: lastOrder.customerEmail,
      createdAt: lastOrder.createdAt
    });
    
    // Send client confirmation email
    const clientEmailData = {
      to: lastOrder.customerEmail,
      subject: `Order Confirmation - ${lastOrder.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #34de73;">Order Confirmation</h2>
          <p>Dear ${lastOrder.customerName},</p>
          
          <p>Thank you for choosing ParaFort for your business formation needs! Your order has been successfully processed.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${lastOrder.orderId}</p>
            <p><strong>Business Name:</strong> ${lastOrder.businessName}</p>
            <p><strong>Entity Type:</strong> ${lastOrder.entityType}</p>
            <p><strong>State:</strong> ${lastOrder.state}</p>
            <p><strong>Total Amount:</strong> $${lastOrder.totalAmount}</p>
            <p><strong>Date:</strong> ${new Date(lastOrder.createdAt).toLocaleDateString()}</p>
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>Our team will begin processing your business formation immediately</li>
            <li>You'll receive regular updates on the progress of your formation</li>
            <li>Most formations are completed within 3-5 business days</li>
            <li>You can track your order status in your ParaFort dashboard</li>
          </ul>
          
          <p>If you have any questions, please don't hesitate to contact us:</p>
          <p style="margin: 5px 0;">📞 Phone: 844-444-5411</p>
          <p style="margin: 5px 0;">📧 Email: support@parafort.com</p>
          <p style="margin: 5px 0;">🌐 Website: www.parafort.com</p>
          
          <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The ParaFort Team
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This email and any attachments are confidential and intended solely for the addressee. 
            If you are not the intended recipient, please notify us immediately and delete this email.
          </p>
        </div>
      `
    };
    
    console.log('Sending client confirmation email to:', lastOrder.customerEmail);
    const clientResult = await emailService.sendEmail(clientEmailData);
    console.log('Client email sent:', clientResult ? 'Success' : 'Failed');
    
    // Send admin notification email
    const adminEmails = ['admin@parafort.com', 'support@parafort.com'];
    
    const adminEmailData = {
      to: adminEmails.join(','),
      subject: `New Formation Order - ${lastOrder.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #34de73;">New Business Formation Order</h2>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚡ Action Required:</strong> New formation order needs processing</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Information:</h3>
            <p><strong>Order ID:</strong> ${lastOrder.orderId}</p>
            <p><strong>Customer Name:</strong> ${lastOrder.customerName}</p>
            <p><strong>Customer Email:</strong> ${lastOrder.customerEmail}</p>
            <p><strong>Business Name:</strong> ${lastOrder.businessName}</p>
            <p><strong>Entity Type:</strong> ${lastOrder.entityType}</p>
            <p><strong>State:</strong> ${lastOrder.state}</p>
            <p><strong>Total Amount:</strong> $${lastOrder.totalAmount}</p>
            <p><strong>Payment Intent:</strong> ${lastOrder.stripePaymentIntentId}</p>
            <p><strong>Order Date:</strong> ${new Date(lastOrder.createdAt).toLocaleString()}</p>
          </div>
          
          <h3>Subscription & Services:</h3>
          <p><strong>Subscription Plan ID:</strong> ${lastOrder.subscriptionPlanId}</p>
          <p><strong>Services Data:</strong> ${lastOrder.servicesData}</p>
          
          <div style="margin: 20px 0;">
            <a href="https://parafort.com/admin/dashboard" style="background-color: #34de73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </div>
          
          <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from the ParaFort system.
          </p>
        </div>
      `
    };
    
    console.log('Sending admin notification email to:', adminEmails.join(', '));
    const adminResult = await emailService.sendEmail(adminEmailData);
    console.log('Admin email sent:', adminResult ? 'Success' : 'Failed');
    
    console.log('\nEmail sending completed!');
    
  } catch (error) {
    console.error('Error sending emails:', error);
  } finally {
    process.exit(0);
  }
}

// Run the function
sendLastOrderEmails();