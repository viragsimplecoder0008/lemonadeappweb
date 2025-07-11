
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for backend operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Backend API: Fetching orders from Supabase...')

    // Fetch orders from Supabase database
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Backend API: Error fetching orders:', ordersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders from database' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!ordersData || ordersData.length === 0) {
      console.log('Backend API: No orders found')
      return new Response(
        JSON.stringify({ orders: [] }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch order items for all orders
    const orderIds = ordersData.map(order => order.id)
    
    console.log(`Backend API: Fetching items for ${orderIds.length} orders...`)

    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .in('order_id', orderIds)

    if (itemsError) {
      console.error('Backend API: Error fetching order items:', itemsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch order items from database' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Group items by order_id
    const itemsByOrderId = (itemsData || []).reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = []
      acc[item.order_id].push(item)
      return acc
    }, {} as Record<string, typeof itemsData>)

    console.log(`Backend API: Processing ${ordersData.length} orders with items...`)

    // Transform database format to frontend Order type
    const orders = ordersData.map(orderData => ({
      id: orderData.id,
      totalPrice: Number(orderData.total_price),
      status: orderData.status,
      createdAt: orderData.created_at,
      isQuickMode: orderData.is_quick_mode || false,
      paymentMethod: orderData.payment_method,
      shippingAddress: {
        fullName: orderData.shipping_full_name,
        address: orderData.shipping_address,
        city: orderData.shipping_city,
        state: orderData.shipping_state,
        postalCode: orderData.shipping_postal_code,
        country: orderData.shipping_country,
        email: orderData.shipping_email || '',
        phoneNumber: orderData.shipping_phone_number,
      },
      items: (itemsByOrderId[orderData.id] || []).map(item => ({
        quantity: item.quantity,
        product: {
          id: item.product_id,
          name: item.product_name,
          description: item.product_description || '',
          price: Number(item.product_price),
          imageUrl: item.product_image_url || undefined,
          category: item.product_category,
          inStock: true,
        }
      }))
    }))

    console.log(`Backend API: Successfully processed ${orders.length} orders`)

    return new Response(
      JSON.stringify({ orders }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Backend API: Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
