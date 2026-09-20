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

## In Progress
- Gemini AI (user's own Google AI Studio key, pending): AI Menu Concierge chat, admin Specials Image Generator (Nano Banana), admin Copywriter. Playbook ready: `google-genai` SDK, `client.aio.models.generate_content`, models via GEMINI_TEXT_MODEL / GEMINI_IMAGE_MODEL env. WAITING ON: GEMINI_API_KEY from user → goes in backend/.env.

## Backlog
- P1: Real phone number + real Instagram/Facebook/TikTok handles (currently placeholders)
- P1: Per-location live map pins (map is a static Mission Bay embed)
- P2: Full cart / online checkout (user chose call-to-order for now)
- P2: Admin menu editor (menu is currently in code)
- P2: Real Instagram API feed for gallery
- P3: Email notifications on new inquiries (Resend)
