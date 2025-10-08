import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  initiatePaystackPayment,
  generatePaymentReference,
  validatePaymentAmount,
  convertToKobo,
} from '@/lib/paystack/client';
import { Database } from '@/lib/supabase/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, planId, billingCycle, customerName, customerEmail } = body;

    // Validate required fields
    if (!userId || !planId || !billingCycle || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch plan details from database
    console.log('Fetching plan with ID:', planId);
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    console.log('Plan query result:', { plan, planError });

    if (planError || !plan) {
      console.error('Plan fetch failed:', planError);
      return NextResponse.json(
        {
          error: 'Invalid plan selected',
          debug: planError ? planError.message : 'Plan not found',
          planId: planId
        },
        { status: 400 }
      );
    }

    // Calculate amount based on billing cycle
    let amount = 0;
    if (billingCycle === 'monthly' && (plan as any).price_monthly) {
      amount = (plan as any).price_monthly;
    } else if (billingCycle === 'annual' && (plan as any).price_annual) {
      amount = (plan as any).price_annual;
    } else if (billingCycle === 'lifetime' && (plan as any).price_lifetime) {
      amount = (plan as any).price_lifetime;
    } else {
      return NextResponse.json(
        { error: 'Invalid billing cycle for selected plan' },
        { status: 400 }
      );
    }

    // Validate amount
    if (!validatePaymentAmount(amount)) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Generate unique payment reference
    const reference = generatePaymentReference();

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        plan_id: planId,
        payment_reference: reference,
        amount,
        billing_cycle: billingCycle,
        status: 'pending',
      } as never)
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Initialize Paystack payment
    // Note: For recurring billing, Paystack requires subscription plans to be created
    // in the dashboard first. For now, we use one-time payments and handle renewals
    // via webhooks. Future enhancement: migrate to Paystack subscriptions.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paystackResponse = await initiatePaystackPayment({
      email: customerEmail,
      amount: convertToKobo(amount), // Convert to kobo (cents)
      reference,
      callback_url: `${appUrl}/payment/verify?reference=${reference}`,
      metadata: {
        userId,
        planId,
        billingCycle,
        customerName: customerName || customerEmail,
        paymentId: (payment as any).id,
        planName: (plan as any).name,
        isRecurring: billingCycle !== 'lifetime', // Flag for future subscription handling
      },
    });

    if (!paystackResponse.status) {
      return NextResponse.json(
        { error: paystackResponse.message || 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentId: (payment as any).id,
      reference,
      authorizationUrl: paystackResponse.data.authorization_url,
      accessCode: paystackResponse.data.access_code,
      amount,
      planName: (plan as any).name,
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
