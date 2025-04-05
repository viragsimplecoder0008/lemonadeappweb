
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  orderId: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalPrice: number;
  customerInfo: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
    deliveryNote?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, items, totalPrice, customerInfo }: OrderEmailRequest = await req.json();

    // Generate the items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "Lemonade Luxury <orders@lemonadeluxury.com>",
      to: ["lemonaderich.82@gmail.com"],
      subject: `New Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="background-color: #F9D923; color: #2A2B2E; padding: 20px; text-align: center;">
            New Order Notification
          </h1>
          
          <div style="padding: 20px;">
            <h2>Order #${orderId}</h2>
            
            <div style="margin-bottom: 20px;">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${customerInfo.fullName}</p>
              <p><strong>Email:</strong> ${customerInfo.email}</p>
              <p><strong>Phone:</strong> ${customerInfo.phoneNumber || 'Not provided'}</p>
              <p><strong>Shipping Address:</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.postalCode}</p>
              ${customerInfo.deliveryNote ? `<p><strong>Delivery Note:</strong> ${customerInfo.deliveryNote}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3>Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 8px; font-weight: bold;">$${totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px;">
              <p style="margin: 0;">This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
          
          <div style="background-color: #2A2B2E; color: white; padding: 15px; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Lemonade Luxury. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
