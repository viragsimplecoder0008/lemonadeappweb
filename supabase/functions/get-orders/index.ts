import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await userClient.auth.getUser(token)
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userId = userData.user.id

    // Check if user is employee/admin
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)

    const isStaff = (roles ?? []).some((r: { role: string }) => r.role === 'admin' || r.role === 'employee')

    let ordersQuery = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })
    if (!isStaff) {
      ordersQuery = ordersQuery.eq('user_id', userId)
    }

    const { data: ordersData, error: ordersError } = await ordersQuery
    if (ordersError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!ordersData || ordersData.length === 0) {
      return new Response(JSON.stringify({ orders: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const orderIds = ordersData.map(o => o.id)
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .in('order_id', orderIds)

    if (itemsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch order items' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const itemsByOrderId = (itemsData || []).reduce((acc: Record<string, any[]>, item: any) => {
      if (!acc[item.order_id]) acc[item.order_id] = []
      acc[item.order_id].push(item)
      return acc
    }, {})

    const orders = ordersData.map((orderData: any) => ({
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
      items: (itemsByOrderId[orderData.id] || []).map((item: any) => ({
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

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Backend API: Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
