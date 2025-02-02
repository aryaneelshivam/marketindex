import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-timestamp',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.text();
    console.log('Received webhook payload:', payload);

    // Get Cashfree webhook signature and timestamp
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    
    if (!signature || !timestamp) {
      throw new Error('Missing webhook signature or timestamp');
    }

    // Verify webhook signature
    const secretKey = Deno.env.get('CASHFREE_SECRET_KEY') ?? '';
    const data = payload + timestamp;
    const expectedSignature = createHmac('sha256', secretKey)
      .update(new TextEncoder().encode(data))
      .toString('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid signature received:', signature);
      console.error('Expected signature:', expectedSignature);
      throw new Error('Invalid webhook signature');
    }

    // Parse and validate the webhook payload
    const event = JSON.parse(payload);
    console.log('Parsed webhook event:', event);

    // Verify the payment status
    if (!event.data || !event.data.order || !event.data.order.order_id) {
      throw new Error('Invalid webhook payload structure');
    }

    const orderId = event.data.order.order_id;
    const paymentStatus = event.data.order.order_status.toLowerCase();

    console.log(`Processing payment status update for order ${orderId}: ${paymentStatus}`);

    // Update payment record in database
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({ 
        status: paymentStatus,
        payment_session_id: event.data.order.cf_order_id || null,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('Error updating payment record:', updateError);
      throw updateError;
    }

    console.log(`Successfully updated payment status for order ${orderId}`);

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});