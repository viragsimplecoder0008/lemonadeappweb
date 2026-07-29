import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "redeem_lemons",
  title: "Redeem lemons",
  description: "Redeem lemons from the signed-in user's balance. Returns the new balance.",
  inputSchema: {
    amount: z.number().int().positive().describe("Number of lemons to redeem."),
    reason: z.string().min(1).describe("Short reason for the redemption."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  handler: async ({ amount, reason }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx).rpc("redeem_lemons", {
      _amount: amount,
      _reason: reason,
    });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `New lemon balance: ${data}` }],
      structuredContent: { new_balance: data },
    };
  },
});
