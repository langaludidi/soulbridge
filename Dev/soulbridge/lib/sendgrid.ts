import sendgrid from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@soulbridge.co.za';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'SoulBridge Memorials';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send a single email using SendGrid
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    await sendgrid.send({
      to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    return { success: true };
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body || error);
    return { success: false, error: error.message };
  }
}

/**
 * Email template for new tribute notification
 */
export function getTributeEmailTemplate({
  memorialName,
  memorialUrl,
  authorName,
  relationship,
  message,
}: {
  memorialName: string;
  memorialUrl: string;
  authorName: string;
  relationship?: string;
  message: string;
}) {
  const subject = `New tribute posted for ${memorialName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💐 New Tribute</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; margin-bottom: 20px;">
            A new tribute has been posted on the memorial page for <strong>${memorialName}</strong>.
          </p>

          <div style="background: white; padding: 20px; border-left: 4px solid #667eea; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${authorName}${relationship ? ` (${relationship})` : ''}</p>
            <p style="margin: 0; color: #666; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${memorialUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Memorial & Tribute
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
            You're receiving this because you own this memorial on SoulBridge.<br>
            <a href="${memorialUrl}" style="color: #667eea;">Manage your memorial</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

/**
 * Email template for new candle notification
 */
export function getCandleEmailTemplate({
  memorialName,
  memorialUrl,
  lighterName,
  candleType,
  dedication,
}: {
  memorialName: string;
  memorialUrl: string;
  lighterName: string;
  candleType: string;
  dedication?: string;
}) {
  const candleEmojis: { [key: string]: string } = {
    remembrance: '🕯️',
    love: '❤️',
    peace: '🕊️',
    prayer: '🙏',
  };

  const emoji = candleEmojis[candleType] || '🕯️';
  const subject = `${emoji} Candle lit for ${memorialName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${emoji} Virtual Candle Lit</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>${lighterName}</strong> has lit a <strong>${candleType}</strong> candle on the memorial page for <strong>${memorialName}</strong>.
          </p>

          ${dedication ? `
            <div style="background: white; padding: 20px; border-left: 4px solid #f59e0b; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-style: italic;">"${dedication}"</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <a href="${memorialUrl}#candles" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View All Candles
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
            You're receiving this because you own this memorial on SoulBridge.<br>
            <a href="${memorialUrl}" style="color: #f59e0b;">Manage your memorial</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

export default sendEmail;
