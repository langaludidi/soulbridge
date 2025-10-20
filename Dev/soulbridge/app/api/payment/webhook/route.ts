import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      console.error('No Paystack signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { reference, status, amount, currency, channel, metadata } = event.data;

      // Get transaction by reference
      const supabase = getSupabaseAdmin();
      const { data: transaction, error: fetchError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('transaction_reference', reference)
        .single();

      if (fetchError || !transaction) {
        console.error('Transaction not found:', reference);
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }

      // Check if already processed
      if (transaction.payment_status === 'successful') {
        console.log('Transaction already processed:', reference);
        return NextResponse.json({ message: 'Already processed' }, { status: 200 });
      }

      // Verify amount matches
      const expectedAmount = transaction.amount * 100; // Convert to kobo
      if (amount !== expectedAmount) {
        console.error('Amount mismatch:', { expected: expectedAmount, received: amount });

        await supabase
          .from('payment_transactions')
          .update({
            payment_status: 'failed',
            failure_reason: 'Amount mismatch',
            paystack_data: event.data,
          })
          .eq('id', transaction.id);

        return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
      }

      // Update transaction to successful
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          payment_status: 'successful',
          paid_at: new Date().toISOString(),
          payment_channel: channel,
          provider_reference: event.data.reference,
          paystack_data: event.data,
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
        return NextResponse.json(
          { error: 'Failed to update transaction' },
          { status: 500 }
        );
      }

      console.log('Payment successful:', reference);

      // The trigger `activate_plan_trigger` will automatically:
      // 1. Expire current active plan
      // 2. Create new plan with entitlements
      // 3. Create/update usage tracking

      return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
    }

    // Handle other events if needed
    console.log('Unhandled event:', event.event);
    return NextResponse.json({ message: 'Event received' }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
