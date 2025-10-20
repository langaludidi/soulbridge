import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planType } = body;

    if (!planType || !['essential', 'premium'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get user profile
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Determine plan details
    const planDetails = getPlanDetails(planType);

    // Generate unique transaction reference
    const transactionReference = `SB_${Date.now()}_${profile.id.substring(0, 8)}`;

    // Create payment transaction record
    const supabase = getSupabaseAdmin();
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        profile_id: profile.id,
        transaction_reference: transactionReference,
        payment_provider: 'paystack',
        amount: planDetails.price,
        currency: 'ZAR',
        plan_type: planType,
        plan_duration_months: planDetails.durationMonths,
        payment_status: 'pending',
        customer_email: profile.email,
        customer_name: profile.full_name || profile.email,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.email,
        amount: planDetails.price * 100, // Paystack expects amount in kobo (cents)
        reference: transactionReference,
        currency: 'ZAR',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          profile_id: profile.id,
          plan_type: planType,
          transaction_id: transaction.id,
          full_name: profile.full_name || profile.email,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error('Paystack initialization error:', paystackData);

      // Update transaction status to failed
      await supabase
        .from('payment_transactions')
        .update({
          payment_status: 'failed',
          failure_reason: paystackData.message || 'Paystack initialization failed',
          paystack_data: paystackData,
        })
        .eq('id', transaction.id);

      return NextResponse.json(
        { error: paystackData.message || 'Payment initialization failed' },
        { status: 500 }
      );
    }

    // Update transaction with Paystack reference
    await supabase
      .from('payment_transactions')
      .update({
        provider_reference: paystackData.data.reference,
        paystack_data: paystackData.data,
      })
      .eq('id', transaction.id);

    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: transactionReference,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getPlanDetails(planType: string) {
  switch (planType) {
    case 'essential':
      return {
        price: 150,
        durationMonths: 6,
      };
    case 'premium':
      return {
        price: 600,
        durationMonths: 12,
      };
    default:
      throw new Error('Invalid plan type');
  }
}
