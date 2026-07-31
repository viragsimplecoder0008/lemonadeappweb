import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-20) : null;
    if (!messages) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const client = body?.clientContext ?? {};

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user ?? null;

    const [productsRes, couponsRes, reviewsRes] = await Promise.all([
      supabase.from("products").select("id,name,description,price,category,in_stock").limit(60),
      supabase.from("coupons").select("code,discount_percent,expires_at,active").eq("active", true).limit(30),
      supabase.from("reviews").select("product_id,rating,comment,created_at").order("created_at", { ascending: false }).limit(30),
    ]);

    let profile: unknown = null;
    let orders: unknown = [];
    if (user) {
      const [p, o] = await Promise.all([
        supabase.from("profiles").select("username,name,vip_status,lemons").eq("id", user.id).maybeSingle(),
        supabase
          .from("orders")
          .select("id,status,total_price,created_at,is_custom,custom_details,payment_method")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      profile = p.data;
      orders = o.data ?? [];
    }

    const vip = (profile as { vip_status?: string } | null)?.vip_status;
    const hasVip = !!vip && vip !== "none";

    const priceMap: Record<string, number> = {
      classic: 3.99,
      mint: 4.49,
      strawberry: 4.99,
      blueberry: 4.99,
      lavender: 5.49,
      ginger: 4.79,
      cola: 4.79,
      rose: 5.49,
    };

    const products = (productsRes.data ?? []).map((p) => {
      const idKey = p.id ? String(p.id).toLowerCase().replace("lemonade-", "") : "";
      const nameKey = p.name ? String(p.name).toLowerCase().split(" ")[0] : "";
      const matchedPrice = priceMap[idKey] ?? priceMap[nameKey];
      return {
        ...p,
        price: matchedPrice !== undefined ? matchedPrice : p.price,
      };
    });

    const context = {
      signedIn: !!user,
      profile,
      vipPrivileges: hasVip ? "Yes" : "No",
      lemonBalance: (profile as { lemons?: number } | null)?.lemons ?? 0,
      orders,
      products,
      activeCoupons: couponsRes.data ?? [],
      customerReviews: reviewsRes.data ?? [],
      cart: client.cart ?? [],
      cartTotal: client.cartTotal ?? 0,
      festivalsPastAndPresent: client.festivals ?? [],
      currentFestival: client.currentFestival ?? null,
      strawberryLemonadeGameDiscount: client.strawberryDiscount ? "Yes - 20% off Strawberry Lemonade earned in the Lemon Catcher game" : "No",
      faq: client.faq ?? [],
      docs: client.docs ?? [],
      currentPage: client.currentPage ?? null,
      newsBanner: (bannerRes.data ?? []).map((b) => ({
        id: b.id,
        Title: b.title,
        "Link.TITLE": b.link_title,
        "Link.LINK": b.link_url,
        LucideIcon: b.lucide_icon,
        sort_order: b.sort_order,
        active: b.active,
      })),
      canEditNewsBanner: isStaff,
    };

    const system = `You are "Lemonade Help", the friendly support assistant for the Lemonade. drink shop (India, Hyderabad/Telangana delivery only).
Answer using ONLY the JSON context below plus general politeness. If something is not in the context, say you don't know and suggest contacting support.
Be concise, warm, and use markdown. Prices are in INR (₹). Online payment is coming soon; only COD is available.
Golden Flavors are VIP-only. Lemons are a reward currency usable towards lemonade.

NEWS BANNER CONTROL:
You also control the scrolling news banner at the top of the site. Its current items are in context.newsBanner.
Each item has: Title, "Link.TITLE" (optional link text), "Link.LINK" (optional in-app path like /monsoon-winter), LucideIcon (a lucide-react icon name like "Sparkles" or "Flame", or null).
Use the news banner tools whenever the user (a staff member) asks you to announce, change, reorder, hide, or remove something on the banner.
Only staff (context.canEditNewsBanner === true) may change it — if a non-staff user asks, politely decline.
Keep titles short (a few words). After changing the banner, confirm what you changed.

CONTEXT JSON:
${JSON.stringify(context)}`;

    const tools = [
      {
        type: "function",
        function: {
          name: "upsert_news_banner_item",
          description: "Create a new news banner item, or update an existing one when id is provided.",
          parameters: {
            type: "object",
            properties: {
              id: { type: "string", description: "Existing item id to update. Omit to create a new item." },
              title: { type: "string", description: "Short headline, e.g. 'New Product!'" },
              link_title: { type: "string", description: "Optional link text shown after the title." },
              link_url: { type: "string", description: "Optional in-app path, e.g. /monsoon-winter" },
              lucide_icon: { type: "string", description: "Optional lucide-react icon name, e.g. Flame, Sparkles, Gift." },
              sort_order: { type: "number", description: "Display order, lower shows first." },
              active: { type: "boolean", description: "Whether the item is shown." },
            },
            required: [],
            additionalProperties: false,
          },
        },
      },
      {
        type: "function",
        function: {
          name: "delete_news_banner_item",
          description: "Permanently delete a news banner item by id.",
          parameters: {
            type: "object",
            properties: { id: { type: "string" } },
            required: ["id"],
            additionalProperties: false,
          },
        },
      },
    ];

    const runTool = async (name: string, args: Record<string, unknown>) => {
      if (!isStaff) return { error: "Not authorized: only employees or admins can change the news banner." };
      if (name === "delete_news_banner_item") {
        const { error } = await supabase.from("news_banner_items").delete().eq("id", String(args.id));
        return error ? { error: error.message } : { ok: true, deleted: args.id };
      }
      if (name === "upsert_news_banner_item") {
        const payload: Record<string, unknown> = {};
        for (const k of ["title", "link_title", "link_url", "lucide_icon", "sort_order", "active"]) {
          if (args[k] !== undefined) payload[k] = args[k];
        }
        if (args.id) {
          const { data, error } = await supabase
            .from("news_banner_items")
            .update(payload)
            .eq("id", String(args.id))
            .select()
            .maybeSingle();
          return error ? { error: error.message } : { ok: true, item: data };
        }
        if (!payload.title) return { error: "title is required to create a banner item" };
        const { data, error } = await supabase.from("news_banner_items").insert(payload).select().maybeSingle();
        return error ? { error: error.message } : { ok: true, item: data };
      }
      return { error: `Unknown tool ${name}` };
    };

    const convo: Record<string, unknown>[] = [{ role: "system", content: system }, ...messages];

    const callGateway = (body: Record<string, unknown>) =>
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Lovable-API-Key": LOVABLE_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-3.6-flash", ...body }),
      });

    // Tool-calling loop (non-streaming) until the model stops requesting tools.
    for (let i = 0; i < 4; i++) {
      const toolResp = await callGateway({ stream: false, tools, messages: convo });
      if (!toolResp.ok) {
        const text = await toolResp.text();
        return new Response(JSON.stringify({ error: text }), {
          status: toolResp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const json = await toolResp.json();
      const msg = json.choices?.[0]?.message;
      const calls = msg?.tool_calls;
      if (!calls || calls.length === 0) break;
      convo.push(msg);
      for (const call of calls) {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function?.arguments || "{}");
        } catch { /* ignore */ }
        const result = await runTool(call.function?.name, args);
        convo.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
      }
    }

    const resp = await callGateway({ stream: true, messages: convo });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: text }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

