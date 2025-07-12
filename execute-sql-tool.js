// Insert sample notification templates for order completion system
const sampleTemplates = [
  {
    templateName: 'formation_completion_email',
    templateType: 'email',
    subject: '🎉 Business Formation Complete - {{businessName}} | Order {{orderId}}',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
        <div style="background: linear-gradient(135deg, #34de73, #20df73); color: white; padding: 30px; text-align: center;">
          <h1>🎉 Business Formation Complete!</h1>
          <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0;">
            ✅ ORDER COMPLETED
          </div>
        </div>
        
        <div style="padding: 30px;">
          <h2>Congratulations, {{customerName}}!</h2>
          <p>Your business formation for <strong>{{businessName}}</strong> has been successfully completed.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <ul>
              <li><strong>Business Name:</strong> {{businessName}}</li>
              <li><strong>Entity Type:</strong> {{entityType}}</li>
              <li><strong>State:</strong> {{state}}</li>
              <li><strong>Order ID:</strong> {{orderId}}</li>
              <li><strong>Completion Date:</strong> {{completionDate}}</li>
            </ul>
          </div>
          
          <div style="background: white; border: 1px solid #34de73; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📜 Your Completion Certificate</h3>
            <p>We've generated your official completion certificate. This document serves as proof that your business has been successfully formed.</p>
            <a href="{{certificateUrl}}" style="background: #34de73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Download Certificate</a>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📅 Important Upcoming Deadlines</h3>
            <p>We've automatically set up compliance tracking for your business. You'll receive reminders for:</p>
            <ul>
              <li>Annual state filing requirements</li>
              <li>Federal tax filing deadlines</li>
              <li>License renewals (if applicable)</li>
              <li>Other state-specific compliance requirements</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p><strong>ParaFort Professional Business Services</strong></p>
          <p>Phone: (844) 444-5411 | Email: support@parafort.com | Website: www.parafort.com</p>
          <p>© {{currentYear}} ParaFort. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['businessName', 'customerName', 'entityType', 'state', 'orderId', 'completionDate', 'certificateUrl', 'currentYear'],
    entityTypes: ['LLC', 'Corporation', 'S-Corporation', 'C-Corporation', 'Professional Corporation', 'Nonprofit Corporation'],
    states: ['All States'],
    isActive: true
  },
  {
    templateName: 'compliance_reminder_email',
    templateType: 'email',
    subject: '📅 Compliance Reminder - {{complianceType}} Due for {{businessName}}',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #856404; margin: 0;">📅 Compliance Reminder</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>Upcoming Deadline for {{businessName}}</h2>
          <p>This is a friendly reminder that you have an upcoming compliance deadline.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Deadline Details:</h3>
            <ul>
              <li><strong>Compliance Type:</strong> {{complianceType}}</li>
              <li><strong>Due Date:</strong> {{dueDate}}</li>
              <li><strong>Days Until Due:</strong> {{daysUntilDue}}</li>
              <li><strong>Filing Fee:</strong> {{filingFee}}</li>
              <li><strong>Description:</strong> {{description}}</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🚀 How ParaFort Can Help</h3>
            <p>Don't worry about missing this deadline. ParaFort can handle this filing for you:</p>
            <ul>
              <li>Professional preparation and filing</li>
              <li>Guaranteed accuracy and on-time submission</li>
              <li>Email confirmation when filed</li>
              <li>Ongoing compliance monitoring</li>
            </ul>
            <a href="{{serviceUrl}}" style="background: #34de73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Get Filing Assistance</a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p><strong>ParaFort Professional Business Services</strong></p>
          <p>Phone: (844) 444-5411 | Email: support@parafort.com</p>
        </div>
      </div>
    `,
    variables: ['businessName', 'complianceType', 'dueDate', 'daysUntilDue', 'filingFee', 'description', 'serviceUrl'],
    entityTypes: ['All Entity Types'],
    states: ['All States'],
    isActive: true
  }
];

console.log('Inserting notification templates...');
console.log(JSON.stringify(sampleTemplates, null, 2));