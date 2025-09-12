# 💳 SoulBridge Payment Integration Guide

SoulBridge uses **Paystack** as the primary payment gateway for South African customers, with NetCash as a secondary option for bank transfers.

## 🏗️ **Architecture Overview**

### **Server-Side Components**
- **Payment Routes**: `/server/billing/routes.ts`
- **Paystack Provider**: `/server/billing/paystack-provider.ts` 
- **NetCash Provider**: `/server/billing/netcash-provider.ts`
- **Type Definitions**: `/server/billing/types.ts`

### **Client-Side Components**
- **PaymentModal**: `/client/src/components/PaymentModal.tsx`
- **Payment Service**: `/client/src/lib/paymentService.ts`
- **Pricing Page**: `/client/src/pages/pricing.tsx` (integrated)

## 🔧 **Setup Instructions**

### **1. Environment Variables**

Add these to your `.env` file:

```env
# Paystack (Required)
PAYSTACK_SECRET_KEY="sk_test_your_secret_key_here"
PAYSTACK_PUBLIC_KEY="pk_test_your_public_key_here" 
PAYSTACK_WEBHOOK_SECRET="your_webhook_secret_here"

# Client-side (for react-paystack)
REACT_APP_PAYSTACK_PUBLIC_KEY="pk_test_your_public_key_here"

# NetCash (Optional)
NETCASH_SERVICE_KEY="your_netcash_service_key_here"
NETCASH_MERCHANT_EMAIL="your_netcash_merchant_email_here"

# App URL
APP_URL="https://yourdomain.com"
```

### **2. Paystack Setup**

1. **Create Paystack Account**: [https://paystack.com](https://paystack.com)
2. **Get API Keys**: Dashboard → Settings → API Keys & Webhooks
3. **Configure Webhook**: Point to `https://yourdomain.com/api/billing/webhook/paystack`
4. **Enable ZAR Currency**: Contact Paystack support for South African Rand

### **3. Test the Integration**

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the application
npm start
```

## 💰 **Subscription Plans**

| Plan | Monthly Price | Features |
|------|---------------|-----------|
| **Remember** | Free | 1 memorial, basic features |
| **Honour** | R49/month | 3 memorials, gallery, audio/video |
| **Legacy** | R99/month | Unlimited memorials, advanced features |
| **Family Vault** | R199/month | Multi-user, premium features |

## 🔌 **API Endpoints**

### **Payment Initialization**
```typescript
POST /api/billing/checkout
{
  "plan": "honour",
  "interval": "monthly", 
  "provider": "paystack"
}
```

### **Subscription Status**
```typescript
GET /api/billing/subscription
// Returns current subscription details
```

### **Webhook Handling**
```typescript
POST /api/billing/webhook/paystack
// Handles Paystack webhook events
```

## 🎨 **Using PaymentModal Component**

```tsx
import PaymentModal from '@/components/PaymentModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  const plan = {
    id: 'honour',
    name: 'Honour',
    price: 49,
    interval: 'monthly',
    description: 'Honor multiple family members...',
    features: ['3 memorials', 'Gallery', 'Audio/Video']
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Subscribe
      </Button>
      
      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        plan={plan}
        onSuccess={() => console.log('Payment successful!')}
      />
    </>
  );
}
```

## 🛡️ **Security Features**

- ✅ **Webhook Signature Verification**
- ✅ **CORS Protection** 
- ✅ **Rate Limiting** on payment endpoints
- ✅ **Input Validation** with Zod schemas
- ✅ **Error Sanitization** (no sensitive data exposed)
- ✅ **SSL/TLS Encryption** for all payment data

## 🔄 **Payment Flow**

1. **User selects plan** → Pricing page
2. **PaymentModal opens** → Choose payment method
3. **Initialize payment** → API call to `/billing/checkout`
4. **Paystack popup** → User completes payment
5. **Webhook received** → Server processes payment
6. **Subscription activated** → Database updated
7. **User redirected** → Success page

## 🧪 **Testing**

### **Test Cards (Paystack)**
- **Success**: `4084084084084081`
- **Insufficient Funds**: `4000000000000002`
- **Declined**: `4000000000000069`

### **Webhook Testing**
Use ngrok for local webhook testing:
```bash
ngrok http 5000
# Use the https URL for Paystack webhook configuration
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Payment Modal doesn't open**
   - Check `REACT_APP_PAYSTACK_PUBLIC_KEY` is set
   - Verify user authentication

2. **Webhook events not processing**
   - Verify webhook URL is accessible
   - Check webhook signature verification
   - Review server logs for errors

3. **Subscription not activating**
   - Check database connection
   - Verify webhook event handling
   - Review `subscriptions` table updates

### **Debug Mode**
Set `NODE_ENV=development` for detailed logging.

## 📞 **Support**

- **Paystack Docs**: [https://paystack.com/docs](https://paystack.com/docs)
- **NetCash Docs**: [https://netcash.co.za/s/s/developers](https://netcash.co.za/s/s/developers)
- **SoulBridge Issues**: Create issues in this repository

---

💡 **Pro Tip**: Always test with Paystack test keys before going live!