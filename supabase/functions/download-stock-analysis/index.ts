import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as XLSX from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs'

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
    // Fetch complete stock analysis data
    const response = await fetch(
      'https://market-index.onrender.com/analyze_stocks?period=3mo'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock analysis data');
    }

    const stockData = await response.json();
    console.log('Fetched stock data:', stockData); // For debugging

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(stockData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Analysis');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

    return new Response(
      JSON.stringify({ fileContent: excelBuffer }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});