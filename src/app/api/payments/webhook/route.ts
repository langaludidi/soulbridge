import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyPaystackWebhook, convertFromKobo } from '@/lib/paystack/client';
import { PaystackWebhookEvent } from '@/lib/paystack/types';
import { Database } from '@/lib/supabase/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify webhook signature
    if (!verifyPaystackWebhook(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const event: PaystackWebhookEvent = JSON.parse(body);

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const paymentData = event.data;

      // Find payment record by reference
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_reference', paymentData.reference)
        .single();

      if (paymentError || !payment) {
        console.error('Payment not found:', paymentData.reference);
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        } as never)
        .eq('id', payment.id);

      if (updateError) {
        console.error('Failed to update payment:', updateError);
        return NextResponse.json(
          { error: 'Failed to update payment' },
          { status: 500 }
        );
      }

      // Activate user subscription
      const { data: plan } = await supabase
        .from('plans')
        .select('name')
        .eq('id', payment.plan_id)
        .single();

      if (plan) {
        const now = new Date();
        let renewalDate: Date | null = null;

        // Calculate renewal date based on billing cycle
        if (payment.billing_cycle === 'monthly') {
          renewalDate = new Date(now);
          renewalDate.setMonth(renewalDate.getMonth() + 1);
        } else if (payment.billing_cycle === 'annual') {
          renewalDate = new Date(now);
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        }

        await supabase
          .from('profiles')
          .update({
            plan: plan.name.toLowerCase() as 'free' | 'essential' | 'family' | 'lifetime',
            subscription_status: 'active',
            plan_start_date: now.toISOString(),
            plan_renewal_date: renewalDate?.toISOString() || null,
            billing_cycle: payment.billing_cycle,
            updated_at: now.toISOString(),
          } as never)
          .eq('id', payment.user_id);

        console.log(`Subscription activated for user ${payment.user_id}, plan: ${plan.name}, renewal: ${renewalDate?.toISOString() || 'lifetime'}`);
      }
    }

    // Handle failed payment
    if (event.event === 'charge.failed') {
      const paymentData = event.data;

      await supabase
        .from('payments')
        .update({
          status: 'failed',
        } as never)
        .eq('payment_reference', paymentData.reference);

      console.log(`Payment failed: ${paymentData.reference}`);
    }

    // Handle subscription creation (if using Paystack subscriptions)
    if (event.event === 'subscription.create') {
      console.log('Subscription created:', event.data);
      // Future: Store subscription_code in profile
    }

    // Handle subscription cancellation
    if (event.event === 'subscription.disable') {
      console.log('Subscription cancelled:', event.data);
      // Future: Update profile subscription_status to 'cancelled'
    }

    // Handle subscription renewal
    if (event.event === 'subscription.not_renew') {
      console.log('Subscription not renewing:', event.data);
      // Future: Update profile to mark as expiring
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check payment status manually
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference' },
        { status: 400 }
      );
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (error || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: payment.status,
      amount: payment.amount,
      createdAt: payment.created_at,
      completedAt: payment.completed_at,
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
