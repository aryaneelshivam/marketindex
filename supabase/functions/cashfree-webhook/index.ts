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

    const payload = await req.text(); // Get raw payload
    console.log('Received webhook payload:', payload);

    // Verify webhook signature
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    
    if (!signature || !timestamp) {
      throw new Error('Missing webhook signature or timestamp');
    }

    // Verify the webhook signature
    const secretKey = Deno.env.get('CASHFREE_SECRET_KEY') ?? '';
    const data = payload + timestamp;
    const expectedSignature = createHmac('sha256', secretKey)
      .update(new TextEncoder().encode(data))
      .toString('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }

    // Parse the payload after verification
    const parsedPayload = JSON.parse(payload);
    
    // Update payment status in database
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({ 
        status: parsedPayload.order.order_status.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('order_id', parsedPayload.order.order_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});