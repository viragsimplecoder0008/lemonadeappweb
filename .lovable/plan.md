This is a large scope. I'll break it into logical groups and ship them in order. Confirm and I'll start.

## 1. Security
- Run security scan, fix all actionable findings, and update security memory.
- Disable Online Payment option (UI + checkout logic), keep COD only.

## 2. Auth & Profiles
- Enable Google social sign-in (button on auth page + Supabase OAuth flow). Requires Google client ID/secret configured in Supabase dashboard (I'll provide instructions).
- Add profile edit page: change name/username/avatar (email read-only). Add `avatar_url` column to `profiles` + Supabase Storage `avatars` bucket with RLS.
- Add Order History view on profile (reuses /orders data).

## 3. VIP & Lemons Rewards
- Employees can approve/reject pending VIP requests (UI in employee dashboard; uses existing "Employees can update VIP status" RLS policy).
- Add `lemons` integer column to `profiles`, and a `lemon_transactions` table.
- VIP page: earn lemons section + redeem lemons for lemonade (with T&C disclaimer).
- Rename "Premium Flavors" → "Golden Flavors". Restrict golden flavors to VIP users only (block add-to-cart for non-VIP).

## 4. Products & Custom Orders
- Remove Jaljeera from product list.
- Add "CUSTOM" button on /products opening a customizer (sweetness slider, ingredients multi-select, notes). Submits as a special order with `is_custom=true` and 24h+ ETA notice.
- Add `is_custom` boolean + `custom_details` jsonb to `orders`.
- Fix admin right-click actions (Edit, Out Of Stock, Delete, Add) — currently local only. Move products to a `products` table in DB, wire actions to it with admin RLS.
- Update category icons: Classic → `Shapes`, Speciality → `Rose`, Golden → `Crown` (lucide doesn't have ChessQueen; I'll use `Crown` which reads as a queen-style icon — let me know if you'd rather use a custom SVG).

## 5. Coupons
- New `coupons` table with `code`, `discount_percent`, `expires_at`, `active`. Admin UI to add/remove; auto-disable when `expires_at < now()` (via SQL view + RLS).
- Apply coupon at checkout.

## 6. Community / Chat
- Remove Live Chat button on /community.
- Add chat groups stored in DB: `chat_groups`, `chat_messages` tables with RLS. Users join groups and send messages; realtime subscription.

## 7. Fixes
- /docs edit button: wire to admin role check, enable edit mode when `has_role(admin)`.
- Festival theme: admin can change accent color when a festival theme is active (admin-only color picker, saved to DB or localStorage based on existing festival system).
- /orders "Contact Support" button: link to /chat or mailto support address.
- Remove "Are your products suitable for people with dietary restrictions?" FAQ.
- Fix mobile menu (it's currently unusable — will rebuild the mobile nav drawer).
- Add cart icon on desktop navbar.
- Fix 100-lemon mini-game scoring/rules (20% off strawberry lemonade coupon on win).

## 8. Database migrations (single batched migration where possible)
- `profiles.avatar_url`, `profiles.lemons`
- `lemon_transactions` table
- `coupons` table + auto-expiry view
- `products` table (seeded from current static data)
- `chat_groups`, `chat_messages`
- `orders.is_custom`, `orders.custom_details`
- `avatars` storage bucket + RLS
- Remove Jaljeera from product list / table

## Sequencing
I'll ship in this order so each piece is testable:
1. Security + Online Payment disable + small fixes (FAQ, Jaljeera, mobile menu, desktop cart, /orders support, /docs edit, remove live chat button)
2. Profile edit + avatar + order history
3. Migrations: products, coupons, chat_groups, lemons, custom orders
4. Admin product CRUD + coupon admin + festival theme color
5. Custom order flow + Golden flavors gating + VIP approvals + lemons earn/redeem
6. Chat groups UI + realtime
7. Mini-game fix
8. Google OAuth (with instructions for you to add credentials in Supabase dashboard)

Two things I need from you:
- Confirm Google sign-in: I'll add the button + code; you'll need to add Google OAuth credentials in the Supabase dashboard (I'll give exact steps).
- `ChessQueen` isn't a lucide icon — OK to use `Crown` for Golden Flavors? (or upload an SVG)

Shall I proceed with this plan?