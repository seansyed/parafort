# Recurring Billing with Saved Payment Methods

## How Your Saved Credit Cards Work with Recurring Invoices

### 1. Payment Method Storage
When you save a credit card in the Payment Methods page:
- Card details are securely stored in Stripe (not on our servers)
- Billing address is saved for invoice generation
- Default payment method is designated for automatic billing

### 2. Subscription Creation Process
For recurring services (monthly/annual compliance, mailbox services, etc.):
```
User subscribes → System finds default payment method → Creates Stripe subscription → Automatic billing begins
```

### 3. Automatic Billing Cycle
- **Monthly Services**: Charged on the same date each month
- **Annual Services**: Charged yearly on subscription anniversary
- **Failed Payments**: System retries 3 times, then notifies you to update payment method

### 4. Invoice Generation
Each successful payment automatically:
- Generates a professional PDF invoice matching your format
- Includes business details, services, and billing address
- Sends email notification with invoice attachment
- Updates your account records

### 5. Payment Method Hierarchy
1. **Default Payment Method**: Used for all automatic billing
2. **Backup Methods**: Available if default fails
3. **Manual Override**: You can specify different methods for specific subscriptions

### 6. Notification System
You receive notifications for:
- Successful recurring payments
- Failed payment attempts
- Payment method expiration warnings
- Invoice generation confirmations

### 7. Managing Recurring Billing
- View all active subscriptions in your dashboard
- Update default payment method anytime
- Cancel subscriptions with proper notice
- Download all historical invoices

## Example Workflow

### Monthly Compliance Service ($99/month)
1. You subscribe and save a Visa ending in 1234 as default
2. System creates Stripe subscription linked to your card
3. On the 15th of each month, Stripe automatically charges $99
4. System generates invoice "INV-2025-001" with your business details
5. You receive email with PDF invoice attachment
6. Process repeats monthly until cancelled

### Benefits
- **No Manual Payments**: Set it and forget it
- **Professional Invoices**: Proper documentation for accounting
- **Real-time Updates**: Immediate notifications and records
- **Secure Processing**: All handled through Stripe's secure platform
- **Easy Management**: Full control through your dashboard

## Security Features
- PCI DSS compliant payment processing
- Encrypted card storage with Stripe
- No sensitive data stored on our servers
- Audit trail for all transactions
- Real-time fraud monitoring