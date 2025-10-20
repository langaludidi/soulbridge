import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Transaction reference required' },
        { status: 400 }
      );
    }

    // Get user profile
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get transaction from database
    const supabase = getSupabaseAdmin();
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('transaction_reference', reference)
      .eq('profile_id', profile.id)
      .single();

    if (fetchError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // If already successful, return current status
    if (transaction.payment_status === 'successful') {
      return NextResponse.json({
        status: 'successful',
        transaction,
      });
    }

    // Verify with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 500 }
      );
    }

    const { status, amount, currency } = paystackData.data;

    // Update transaction status
    if (status === 'success') {
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          payment_status: 'successful',
          paid_at: new Date().toISOString(),
          payment_channel: paystackData.data.channel,
          provider_reference: paystackData.data.reference,
          paystack_data: paystackData.data,
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
        return NextResponse.json(
          { error: 'Failed to update transaction' },
          { status: 500 }
        );
      }

      // Get updated transaction
      const { data: updatedTransaction } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transaction.id)
        .single();

      return NextResponse.json({
        status: 'successful',
        transaction: updatedTransaction,
      });
    } else {
      // Payment failed or pending
      await supabase
        .from('payment_transactions')
        .update({
          payment_status: status === 'failed' ? 'failed' : 'pending',
          failure_reason: paystackData.data.gateway_response,
          paystack_data: paystackData.data,
        })
        .eq('id', transaction.id);

      return NextResponse.json({
        status,
        message: paystackData.data.gateway_response,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
