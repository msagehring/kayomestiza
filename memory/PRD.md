# KAYO MESTIZA — PRD

## Original Problem Statement
Bold, mobile-first website for KAYO MESTIZA — "Blasian Fire & Street Eats." 90s streetwear / graffiti / sticker-art identity in Filipino flag colors. Nav: Home, Menu, Truck Schedule, Order, Catering, About, Gallery, Contact. Full menu (Skewers & Tacos, From the Griddle, Lumpia Lineup, Sweet Bakes), kinetic hero with VIEW MENU / FIND THE TRUCK / ORDER NOW, Fan Favorites, category tabs, sticky mobile order buttons, catering form, socials, truck schedule + map, Instagram-style gallery. Awwwards-level craft: masked line-by-line hero reveal, numbered manifesto chapters, slow editorial marquee, framer-motion scroll reveals, Lenis smooth scrolling, parallax hero moment.

## Architecture
- Backend: FastAPI + Motor (MongoDB), all routes under /api in `backend/server.py`.
  - Auth: single seeded admin, bcrypt + JWT (24h httpOnly cookie `access_token`, Bearer fallback).
  - Endpoints: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me, GET /api/schedule (public), PUT /api/schedule (admin), POST /api/inquiries (public), GET /api/inquiries (admin).
  - Seeds: admin user (idempotent) + 7-day default schedule.
- Frontend: Vite + React 19 + TS strict. Single-page Home with anchor sections + /admin page.
  - Motion: `motion` (framer-motion) reveals, Lenis (`autoRaf`, `anchors: true`) smooth scroll.
  - Fonts: Space Grotesk (display), DM Sans (body), Geist Mono (overlines) via fontsource.
  - Theme tokens in index.css: flame #FF4500, gold #FFD700, scarlet #CE1126, deepblue #0038A8, coal #0B0C10.
  - AI-generated brand photography (12 images, Emergent static CDN) in `src/data/menu.ts`.
  - Ordering = call/text-to-order (tel:/sms: (415) 555-0199 placeholder number) per user choice.

## User Personas
- Hungry street-food fan (mobile-first: find truck, view menu, call to order)
- Event planner (catering packages + inquiry form)
- Truck owner/admin (edits weekly schedule, reads inquiry inbox at /admin)

## Implemented (2026-09)
- **Pop-Up Alerts waitlist (2026-09-20)**
  - `POST /api/waitlist` (public): email required, optional mobile + SMS opt-in, `source` tag. Phone normalized to +1XXXXXXXXXX. Re-submitting the same email merges instead of duplicating.
  - `GET /api/waitlist` (admin) + `GET /api/waitlist/export` (admin CSV download).
  - UI: `WaitlistSection.tsx` ("Pop-Up Alerts", anchor `#newsletter`, fed by the drop + pop-ups CTAs); footer signup now posts to the waitlist with `source: footer`.
  - Admin: Pop-Up Alert List table + Download CSV button.
  - Drop copy set to the owner's tentative target: "Opening Winter 2026 / targeting December 1, 2026 (tentative)" — still no hard timer until a confirmed date is entered in /admin.
  - PENDING FROM OWNER: confirmed pop-up date + venue/address, real phone/email/socials, and whether alerts should auto-send (Twilio SMS vs Resend email vs manual CSV).

- **Pre-launch cleanup + Fredericksburg pivot (2026-09-20)**
  - Truck is now based in **Fredericksburg, VA**. All San Francisco / "in the Bay" copy, the SF map embed, and the Bay-Area venue seed are gone. Hero image regenerated without the old "MANILA TO SF" graffiti.
  - **Pricing (owner-supplied)**: combos $13 / $14 / $12 / $28 / $10; a la carte repriced so combos read as a real discount — Griddle $9–11, Traditional Lumpia (2 pc) $4.50, Baboy Kabob $4/skewer, Adobo Taco $4 ea, specialty rolls $4.50, Turon $6, cassava/mango $5.50, carrot cheesecake $6. All prices render via `fmtPrice()` → `$X.XX`.
  - **Pop-Ups & Events** replaces the fixed weekly schedule (nav label too). Schedule starts empty with a "No pop-ups announced yet" state + "Get Pop-Up Alerts" CTA; owner adds approved spots in `/admin`. No auto-seeded venues anymore.
  - **Drop → waitlist**: with `drop.drop_at = null` the section renders "First Pop-Up Coming Soon" with no timer and no blurred mystery item. Setting a date in `/admin` restores the countdown.
  - **Catering**: per-guest pricing and capacity promises removed — three "Quoted per event" packages plus a note that nothing is confirmed until menu/timing/location are agreed.
  - **Socials**: Facebook + TikTok added to settings; all social icons (footer, contact, gallery follow button) stay hidden until a real URL is saved in `/admin`. Placeholder IG link cleared.
  - Bug fixed by testing agent: `PUT /api/schedule` 500 on an empty entries array.
  - STILL PLACEHOLDER: phone `826-272-5555` and email `eats@kayomestiza.com` — owner must replace in `/admin` before launch (note shown in the admin settings editor). Owner also still owes real weekly pop-up spots.
  - Verified: 19/19 backend pytest + full frontend pass (`/app/test_reports/iteration_3.json`).

- **Gemini AI Suite (2026-09-20)** — user's own Google AI Studio key in `backend/.env` (`GEMINI_API_KEY`), never exposed to the browser.
  - `POST /api/ai/concierge` (public): Menu Concierge chat. Grounded on the live menu JSON sent from `src/data/menu.ts` + the MongoDB truck schedule; refuses to invent items/prices. Multi-turn memory per `session_id` in `db.ai_chats`. UI: `MenuConcierge.tsx` floating "Ask the Truck" widget on Home.
  - `POST /api/ai/copy` (admin): brand copywriter, 3 variants per brief, channel picker (IG caption / SMS blast / menu description / hero headline / flyer).
  - `POST /api/ai/specials-image` (admin): Nano Banana specials image generator. **Currently returns HTTP 402 with a friendly message — the user's AI Studio key has no image quota on the free tier; enabling billing on that Google Cloud project switches it on.**
  - Text model chain (`GEMINI_TEXT_MODELS`): gemini-3.8-flash → 3.7-flash → 3.5-flash, because 3.8/3.7 intermittently return 503 "high demand".
  - Admin UI: `AiStudio.tsx` panel at top of `/admin`. Tested end-to-end (iteration_2.json — 13/13 backend, frontend 100%).

## Implemented (2026-07)
- Kinetic masked-reveal hero with the real graffiti wordmark (from the concept logos, isolated to a transparent PNG at /wordmark.png) + parallax sun watermark + floating dish card
- Sticker marquee ribbon, bento Fan Favorites grid (5 items w/ heat levels)
- Full tabbed menu (13 items, 4 categories, prices, heat, dietary tags)
- Truck schedule cards + "Today" highlight + Google Maps embed + directions links
- Order section + sticky mobile bar (call / text / find truck)
- Catering form (3 package tiers) + contact form + newsletter — all saved to MongoDB
- Numbered manifesto (3 chapters), Instagram-style masonry gallery, brutalist footer
- /admin: JWT login, schedule editor (add/edit/remove/publish), inquiry inbox
- Graffiti wordmark hero (concept logo isolated to transparent /wordmark.png)
- Crown favicon + apple-touch-icon cropped from the logo crown
- Drop 001 primetime countdown section (live timer to Saturday noon, classified mystery item, drop-alert CTAs)
- **Site Settings (2026-07-20)**: shared `settings` doc in MongoDB. GET /api/settings (public), PUT /api/settings (admin). `/admin` "Launch Drop & Contact" editor controls: drop enabled toggle, drop date/time, item name, overline, subtitle, location note + contact phone (display + dial), email, Instagram. DropCountdown + all Order/Call/Text/email/Instagram links across the site derive from settings via `useSettings()`/`useContact()` hook. Countdown uses drop_at (or auto next-Saturday-noon when blank). Tested end-to-end (iteration_1.json — all pass).
- **Contact details set**: phone 826-272-5555 (+18262725555). Drop date currently ~60 days out.
- **Combos & Flights menu (2026-07-20)**: new lead menu category with 5 bundles — The Kayo Box ($18), The Street Walk ($24), The Soul-Roll Flight ($22), The Blasian Feast ($42), The Encore Basket ($13). Prices are suggested bundle prices (editable in code `src/data/menu.ts`).
- Hero overline → "Blasian Street Eats"; footer tag → "Proudly Blasian since 1982".

## In Progress
- None. (Gemini AI Suite shipped 2026-09-20; specials image generator blocked only by Google billing on the user's key.)

## Backlog
- P1: Per-location live map pins (map is a static Mission Bay embed)
- P2: Full cart / online checkout (user chose call-to-order for now)
- P2: Admin menu editor (menu is currently in code)
- P2: Real Instagram API feed for gallery
- P3: Email notifications on new inquiries (Resend)
