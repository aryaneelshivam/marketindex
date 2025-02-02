import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as XLSX from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch stock data
    const { data: stockData, error } = await supabaseClient
      .from('stock_data')
      .select('*')
      .order('symbol')

    if (error) throw error

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(stockData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Analysis')

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })

    return new Response(
      JSON.stringify({ fileContent: excelBuffer }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})