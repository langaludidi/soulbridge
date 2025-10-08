import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyPaystackPayment, convertFromKobo } from '@/lib/paystack/client';
import { Database } from '@/lib/supabase/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference parameter' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const verificationResponse = await verifyPaystackPayment(reference);

    if (!verificationResponse.status) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = verificationResponse.data;

    // Find payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', reference);
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Determine payment status
    let status: 'completed' | 'failed' | 'pending' = 'pending';
    if (paymentData.status === 'success') {
      status = 'completed';
    } else if (paymentData.status === 'failed') {
      status = 'failed';
    }

    // Update payment status in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      } as never)
      .eq('id', (payment as any).id);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
    }

    // If payment is successful, activate user subscription
    if (status === 'completed' && paymentData.metadata) {
      const { data: plan } = await supabase
        .from('plans')
        .select('name')
        .eq('id', (payment as any).plan_id)
        .single();

      if (plan) {
        const now = new Date();
        let renewalDate: Date | null = null;

        // Calculate renewal date based on billing cycle
        if ((payment as any).billing_cycle === 'monthly') {
          renewalDate = new Date(now);
          renewalDate.setMonth(renewalDate.getMonth() + 1);
        } else if ((payment as any).billing_cycle === 'annual') {
          renewalDate = new Date(now);
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        }
        // Lifetime has no renewal date

        // Update user profile with subscription details
        const { error: profileError } = await supabase
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

        if (profileError) {
          console.error('Failed to update profile:', profileError);
        }
      }
    }

    // Redirect to success or failure page
    const redirectUrl = status === 'completed'
      ? `/payment/success?reference=${reference}`
      : `/payment/failure?reference=${reference}`;

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
