# Lemonade — Handcrafted Gourmet Lemonade E-Commerce & AI Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_|_Realtime-green.svg?logo=supabase)](https://supabase.com/)
[![AI Model](https://img.shields.io/badge/AI_Engine-Gemini_3.6_Flash-orange.svg)](https://ai.google.dev/)

**Lemonade** is a modern, high-performance web application designed for a luxury handcrafted lemonade beverage brand based in Hyderabad, India. Built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Supabase**, it features full e-commerce capabilities, an AI-powered streaming support chatbot, a tiered VIP loyalty rewards system, a canvas mini-game, real-time community chat channels, and an administrative control panel.

---

## Key Features

### E-Commerce & Product Customization
* **Curated Flavor Catalog**: Explore categories ranging from *Classic* (Classic, Mint) to *Specialty* (Ginger, Strawberry, Blueberry) and *Golden Flavors* (Lavender, Rose, Cola).
* **Custom Brew Builder**: Customizer for users to adjust sweetness levels, mix natural ingredient infusions, and add custom brewing requests (`is_custom` order flow).
* **Shopping Cart & Checkout**: Persistent cart state, Cash on Delivery (COD) payment processing, order history, and order tracking.
* **Coupon & Promotion Engine**: Active promo code validation with automatic expiry dates and percentage-based discounts.

### AI Support Assistant ("Lemonade Help")
* **Real-time Streaming Chat**: Integrated with Supabase Edge Functions and the Lovable AI Gateway running **Google Gemini 3.6 Flash**.
* **Context-Aware Reasoning**: The AI automatically inspects the user's active cart items, current page URL, user profile, past order history, available coupons, FAQ data, and Markdown documentation.
* **Rich Markdown & GFM Table Rendering**: Custom frontend Markdown engine rendering inline text styling, callout boxes, and GitHub Flavored Markdown (GFM) comparison tables directly within the chat window.

### VIP Loyalty Program & "Lemons" Currency
* **Rewards Balance**: Users earn **Lemons** (reward points) on purchases that can be redeemed for complimentary drinks.
* **VIP Privilege Tier**: Employee-approved VIP status granting exclusive access to *Golden Flavors* and priority customer support.
* **Lemon Catcher Mini-Game**: An interactive canvas arcade game where players catch falling lemons to achieve high scores and automatically unlock a 20% discount coupon on Strawberry Lemonade.

### Community & Real-Time Social Hub
* **Real-time Chat Channels**: Public chat rooms (*General*, *Recipes*, *Feedback*) powered by Supabase Realtime channels.
* **Ratings & Product Reviews**: Customer review submission system with verified order tags and star ratings.

### Role-Based Access Control (RBAC) & Administration
* **Multi-Role User System**: Support for **Customer**, **Employee**, and **Admin** roles.
* **Admin Dashboard**: Full CRUD management over products, promo coupons, live support moderation, and festival theme customization.
* **Interactive Documentation Engine**: Built-in Markdown documentation center (`/docs`) with live in-browser editing for administrators.

---

## Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Core** | React 18, Vite 5, TypeScript | SPA architecture with HMR development |
| **Styling & UI** | Tailwind CSS, Shadcn UI, Lucide Icons | Glassmorphic design, responsive mobile drawer |
| **State & Data** | Context API, React Query | `CartContext`, `AuthContext`, `AdminContext` |
| **Backend & DB** | Supabase (PostgreSQL) | Auth (Email + Google OAuth), RLS Policies, Realtime |
| **Storage** | Supabase Storage | Public avatars bucket with user RLS policies |
| **Serverless Edge** | Deno / Supabase Edge Functions | `help-chat`, `mcp`, `get-orders`, `send-order-email` |
| **AI Integration** | Lovable AI Gateway / Gemini 3.6 Flash | SSE streaming text response engine |
| **Tool Protocol** | Model Context Protocol (MCP) | `list_products`, `get_order`, `redeem_lemons`, `get_my_profile` |

---

## Directory Architecture

```
lemonade-rich/
├── public/                     # Static assets & product imagery
├── src/
│   ├── components/
│   │   ├── cart/               # Cart items, summary & drawer
│   │   ├── checkout/           # Checkout form & payment logic
│   │   ├── docs/               # Doc viewer, MarkdownRenderer & editor
│   │   ├── help/               # HelpChat AI streaming interface
│   │   ├── home/               # Hero, categories, banner & testimonials
│   │   ├── layout/             # Header, footer, mobile nav & layout
│   │   └── ui/                 # Shadcn UI primitives (button, dialog, etc.)
│   ├── context/                # Auth, Cart, and Admin React contexts
│   ├── data/                   # Initial catalogs (products, faq, docs)
│   ├── hooks/                  # Custom React hooks (useAuth, useMobile)
│   ├── integrations/           # Supabase client setup & generated types
│   ├── lib/                    # MCP tools & utility helpers
│   ├── pages/                  # Application views (20+ routes)
│   └── types/                  # TypeScript interfaces & domain models
├── supabase/
│   ├── functions/              # Edge functions (help-chat, mcp, etc.)
│   └── migrations/             # Database DDL & seed SQL scripts
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## Product Pricing Catalog

| Flavor | Category | Price (INR) | VIP Required |
| :--- | :--- | :---: | :---: |
| **Classic Lemonade** | Classic | ₹3.99 | No |
| **Mint Lemonade** | Classic | ₹4.49 | No |
| **Ginger Lemonade** | Specialty | ₹4.79 | No |
| **Cola Lemonade** | Specialty | ₹4.79 | No |
| **Strawberry Lemonade** | Specialty | ₹4.99 | No |
| **Blueberry Lemonade** | Specialty | ₹4.99 | No |
| **Lavender Lemonade** | Golden | ₹5.49 | **Yes** |
| **Rose Lemonade** | Golden | ₹5.49 | **Yes** |

---

## Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **bun** package manager

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/viragsimplecoder0008/lemonadeappweb.git
   cd lemonadeappweb
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` (or the port specified in terminal output) to view the app in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Supabase & Edge Functions Setup

The project uses Supabase Edge Functions for AI support chat and MCP tool integration.

### Edge Functions
* `help-chat`: Serverless endpoint that collates client state and DB context, sending prompts to Google Gemini via Lovable AI Gateway.
* `mcp`: Exposes Model Context Protocol tools for AI integration.

To deploy Supabase functions:
```bash
supabase functions deploy help-chat
supabase functions deploy mcp
```

---

## License & Credits

Built by the **Lemonade** development team. Powered by [Vite](https://vitejs.dev/), [React](https://react.org/), [Tailwind CSS](https://tailwindcss.com/), [Supabase](https://supabase.com/), and [Google Gemini](https://ai.google.dev/).
