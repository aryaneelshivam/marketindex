import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { email } = await req.json()

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Create payment in database
    const { error: dbError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: orderId,
        amount: 199,
        currency: 'INR',
        customer_email: email,
      })

    if (dbError) throw dbError

    // Create Cashfree payment session
    const response = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'x-client-id': Deno.env.get('CASHFREE_APP_ID') ?? '',
        'x-client-secret': Deno.env.get('CASHFREE_SECRET_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: 199,
        order_currency: 'INR',
        customer_details: {
          customer_id: email,
          customer_email: email,
        },
        order_meta: {
          return_url: 'https://market-index.onrender.com/payment-success?order_id={order_id}',
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment session')
    }

    const paymentSession = await response.json()
    console.log('Payment session created:', paymentSession)

    // Update payment with session ID
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({ payment_session_id: paymentSession.payment_session_id })
      .eq('order_id', orderId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify(paymentSession),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})