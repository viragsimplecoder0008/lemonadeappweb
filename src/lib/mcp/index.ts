import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyOrders from "./tools/list-my-orders";
import getOrder from "./tools/get-order";
import listProducts from "./tools/list-products";
import getMyProfile from "./tools/get-my-profile";
import redeemLemons from "./tools/redeem-lemons";

// Build the OAuth issuer from the Supabase project ref. Vite inlines
// import.meta.env.VITE_SUPABASE_PROJECT_ID at build time, so this stays
// import-safe (no runtime env read at module load).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "lemonade-mcp",
  title: "Lemonade.",
  version: "0.1.0",
  instructions:
    "Tools for the Lemonade. app. Callers act as their signed-in Lemonade. user: browse products, read their own orders and profile, and redeem lemons.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMyOrders, getOrder, listProducts, getMyProfile, redeemLemons],
});
