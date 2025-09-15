// Email notification system for SoulBridge
import { logger } from './logger';

interface EmailNotification {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

interface MemorialCreatedData {
  memorialId: string;
  memorialName: string;
  creatorName: string;
}

interface TributeSubmittedData {
  memorialId: string;
  memorialName: string;
  tributeAuthor: string;
  tributeMessage: string;
}

interface OrderOfServiceCreatedData {
  memorialId: string;
  memorialName: string;
  orderOfServiceTitle: string;
  serviceDate?: string;
  venue?: string;
}

// Email templates
const EMAIL_TEMPLATES = {
  MEMORIAL_CREATED: `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c2c2c; font-size: 28px; margin: 0;">SoulBridge</h1>
          <p style="color: #666; margin: 10px 0;">Digital Memorial Platform</p>
        </div>
        
        <div style="border: 2px solid #d4b896; padding: 30px; border-radius: 8px; background: linear-gradient(135deg, #f8f6f3 0%, #ffffff 100%);">
          <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Memorial Created Successfully</h2>
          
          <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 4px;">
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">Dear {{creatorName}},</p>
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              Your memorial for <strong>{{memorialName}}</strong> has been successfully created and is now live on SoulBridge.
            </p>
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              Family and friends can now visit the memorial to share memories, leave tributes, and celebrate the life and legacy of your loved one.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{memorialUrl}}" style="background: #d4b896; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Memorial
            </a>
          </div>
          
          <div style="background: #f5f3f0; padding: 20px; border-radius: 4px; margin-top: 20px;">
            <h4 style="color: #8b6914; margin: 0 0 10px 0;">Next Steps:</h4>
            <ul style="color: #555; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Share the memorial link with family and friends</li>
              <li>Add more photos to the memorial gallery</li>
              <li>Create an Order of Service if needed</li>
              <li>Customize the memorial settings</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">
          <p>With love and remembrance,<br>The SoulBridge Team</p>
        </div>
      </div>
    </div>
  `,

  TRIBUTE_SUBMITTED: `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c2c2c; font-size: 28px; margin: 0;">SoulBridge</h1>
          <p style="color: #666; margin: 10px 0;">Digital Memorial Platform</p>
        </div>
        
        <div style="border: 2px solid #d4b896; padding: 30px; border-radius: 8px; background: linear-gradient(135deg, #f8f6f3 0%, #ffffff 100%);">
          <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; text-align: center;">New Tribute Received</h2>
          
          <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 4px;">
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              Someone has left a tribute on <strong>{{memorialName}}</strong>'s memorial.
            </p>
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              <strong>From:</strong> {{tributeAuthor}}
            </p>
            <div style="background: #f5f3f0; padding: 15px; border-radius: 4px; border-left: 4px solid #d4b896;">
              <p style="color: #555; line-height: 1.6; margin: 0; font-style: italic;">
                "{{tributeMessage}}"
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{memorialUrl}}" style="background: #d4b896; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Tribute
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">
          <p>With love and remembrance,<br>The SoulBridge Team</p>
        </div>
      </div>
    </div>
  `,

  ORDER_OF_SERVICE_CREATED: `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c2c2c; font-size: 28px; margin: 0;">SoulBridge</h1>
          <p style="color: #666; margin: 10px 0;">Digital Memorial Platform</p>
        </div>
        
        <div style="border: 2px solid #d4b896; padding: 30px; border-radius: 8px; background: linear-gradient(135deg, #f8f6f3 0%, #ffffff 100%);">
          <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Order of Service Created</h2>
          
          <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 4px;">
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              An Order of Service has been created for <strong>{{memorialName}}</strong>'s memorial.
            </p>
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              <strong>Title:</strong> {{orderOfServiceTitle}}
            </p>
            {{#if serviceDate}}
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              <strong>Service Date:</strong> {{serviceDate}}
            </p>
            {{/if}}
            {{#if venue}}
            <p style="color: #333; line-height: 1.6; margin: 0 0 15px 0;">
              <strong>Venue:</strong> {{venue}}
            </p>
            {{/if}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{orderOfServiceUrl}}" style="background: #d4b896; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Order of Service
            </a>
          </div>
          
          <div style="background: #f5f3f0; padding: 20px; border-radius: 4px; margin-top: 20px;">
            <p style="color: #555; line-height: 1.6; margin: 0;">
              <strong>Note:</strong> The Order of Service can be downloaded as a PDF and shared with family and friends for the memorial service.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">
          <p>With love and remembrance,<br>The SoulBridge Team</p>
        </div>
      </div>
    </div>
  `
};

// Simple template engine
function renderTemplate(template: string, data: Record<string, any>): string {
  let rendered = template;
  
  // Replace {{variable}} with data values
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value || ''));
  }
  
  // Handle conditional blocks {{#if variable}}content{{/if}}
  rendered = rendered.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  return rendered;
}

// Mock email service (replace with actual service like SendGrid, Mailgun, etc.)
async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      logger.info('📧 Email notification (development mode)', {
        to: notification.to,
        subject: notification.subject,
        template: notification.template
      });
      return true;
    }

    // In production, integrate with actual email service
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: notification.to,
      from: 'notifications@soulbridge.co.za',
      subject: notification.subject,
      html: renderTemplate(EMAIL_TEMPLATES[notification.template], notification.data)
    };
    
    await sgMail.send(msg);
    */
    
    logger.info('📧 Email notification sent', {
      to: notification.to,
      subject: notification.subject
    });
    
    return true;
  } catch (error) {
    logger.error('Failed to send email notification', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: notification.to,
      subject: notification.subject
    });
    return false;
  }
}

// Notification functions
export async function notifyMemorialCreated(
  email: string,
  data: MemorialCreatedData
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `Memorial Created: ${data.memorialName}`,
    template: 'MEMORIAL_CREATED',
    data: {
      ...data,
      memorialUrl: `${process.env.BASE_URL || 'https://soulbridge.co.za'}/memorial/${data.memorialId}`
    }
  });
}

export async function notifyTributeSubmitted(
  email: string,
  data: TributeSubmittedData
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `New Tribute: ${data.memorialName}`,
    template: 'TRIBUTE_SUBMITTED',
    data: {
      ...data,
      memorialUrl: `${process.env.BASE_URL || 'https://soulbridge.co.za'}/memorial/${data.memorialId}`,
      tributeMessage: data.tributeMessage.length > 200 
        ? data.tributeMessage.substring(0, 200) + '...' 
        : data.tributeMessage
    }
  });
}

export async function notifyOrderOfServiceCreated(
  email: string,
  data: OrderOfServiceCreatedData
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `Order of Service Created: ${data.memorialName}`,
    template: 'ORDER_OF_SERVICE_CREATED',
    data: {
      ...data,
      orderOfServiceUrl: `${process.env.BASE_URL || 'https://soulbridge.co.za'}/order-of-service/${data.memorialId}`
    }
  });
}

export default {
  notifyMemorialCreated,
  notifyTributeSubmitted,
  notifyOrderOfServiceCreated
};