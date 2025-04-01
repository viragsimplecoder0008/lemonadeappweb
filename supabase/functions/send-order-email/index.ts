
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order } = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Lemonade Rich <orders@lemonaderich.lovable.app>",
      to: ["lemonaderich.82@gmail.com"],
      subject: `New Order #${order.id}`,
      html: `
        <h1>New Order Received</h1>
        <p>Order Details:</p>
        <ul>
          <li>Order ID: ${order.id}</li>
          <li>Total Price: $${order.totalPrice.toFixed(2)}</li>
          <li>Number of Items: ${order.items.length}</li>
        </ul>
        <h2>Order Items:</h2>
        <table>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${order.items.map(item => `
            <tr>
              <td>${item.product.name}</td>
              <td>${item.quantity}</td>
              <td>$${(item.product.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending order email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
