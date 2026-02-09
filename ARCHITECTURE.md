# Quickly - System Architecture

## Overview
Quickly is a full-stack SaaS platform for NFC & QR social cards with link-in-bio functionality.

## Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Marketing │  │  Auth    │  │  Client  │  │  Admin   │   │
│  │  Pages   │  │  Pages   │  │Dashboard │  │Dashboard │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│       └─────────────┴──────────────┴──────────────┘          │
│                          │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS (App Router) - VERCEL                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Components + Server Actions                   │   │
│  │  - SSR for public profiles (SEO)                      │   │
│  │  - Client Components for dashboards                   │   │
│  │  - API Routes for webhooks                            │   │
│  └───────────────────────┬──────────────────────────────┘   │
└────────────────────────────┼──────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   SUPABASE AUTH          │  │   SUPABASE STORAGE       │
│   - JWT tokens           │  │   - Avatars/logos        │
│   - Email auth           │  │   - Background images    │
│   - Password reset       │  │   - Product images       │
│   - RLS integration      │  │   - Public/private       │
└────────────┬─────────────┘  └────────────┬─────────────┘
             │                              │
             └──────────┬───────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE POSTGRES (RLS)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables:                                              │   │
│  │  - profiles (user data, theme, template)             │   │
│  │  - links (client links/buttons)                      │   │
│  │  - cards (NFC/QR inventory)                          │   │
│  │  - card_activations (activation codes)               │   │
│  │  - products (card types for sale)                    │   │
│  │  - orders (purchase records)                         │   │
│  │  - templates (theme templates)                       │   │
│  │  - page_views (analytics)                            │   │
│  │  - link_clicks (analytics)                           │   │
│  │                                                        │   │
│  │  RLS Policies:                                        │   │
│  │  - Clients: own data only                            │   │
│  │  - Admins: all data                                  │   │
│  │  - Visitors: public profiles only                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                               │
│  - WhatsApp Business API (payment conversion)                │
│  - Analytics (privacy-friendly)                              │
│  - Email (Supabase or SendGrid)                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Card Scan/Tap Flow
```
Visitor scans QR → quickly.com/u/johndoe
    ↓
Next.js SSR fetches profile + links from Supabase
    ↓
Renders template (classic/card/split) with theme_json
    ↓
Log page_view (optional: country, referrer)
    ↓
Visitor clicks link → Log link_click
```

### 2. Client Onboarding Flow
```
Client signs up → Supabase Auth creates user
    ↓
Profile record auto-created via trigger
    ↓
Client enters activation code → Validates in card_activations
    ↓
Card assigned to client (cards.assigned_to = user_id)
    ↓
Client chooses username → Updates profiles.username
    ↓
Client edits theme/template → Updates profiles.theme_json
    ↓
Client adds links → Inserts into links table
```

### 3. Admin Management Flow
```
Admin logs in → role='admin' check
    ↓
Views all orders/cards/clients via RLS admin policy
    ↓
Assigns card to client → Updates cards.assigned_to
    ↓
Manages products → CRUD on products table
    ↓
Disables abusive page → Updates profiles.is_active = false
```

## Security Model

### Authentication
- Supabase Auth with JWT tokens
- Email/password (extendable to OAuth)
- Row Level Security on all tables

### Authorization Layers
1. **RLS Policies** - Database level (primary)
2. **Server Actions** - Application level validation
3. **Middleware** - Route protection

### Data Protection
- Client data isolated by user_id
- Admin access via role check in JWT claims
- Public profiles expose only safe fields
- Input sanitization on all URL fields
- XSS prevention via React escaping

## Performance Optimization

### Frontend
- Server Components for initial load
- Client Components for interactivity
- Image optimization (Next.js Image)
- Code splitting by route
- Lazy loading components

### Backend
- Database indexes on username, card_uid
- Connection pooling (Supabase)
- Edge caching for public profiles
- Analytics aggregated via views

### SEO
- SSR for public profiles (/u/[slug])
- Meta tags per profile
- Sitemap generation
- Structured data (JSON-LD)

## Deployment Strategy

### Development
```
Local: next dev + Supabase local (optional)
Staging: Vercel preview + Supabase dev project
```

### Production
```
Vercel: Automatic deployment from main branch
Supabase: Production project with backups
Environment: Secrets in Vercel
```

## Monitoring & Analytics

### Application Metrics
- Vercel Analytics (Web Vitals)
- Supabase Dashboard (DB performance)
- Error tracking (Next.js error boundaries)

### Business Metrics
- Page views per profile
- Link clicks per link
- Card activation rate
- User retention

## Scalability Considerations

### Current (MVP)
- Handles ~10k profiles
- ~100k page views/month
- Supabase free tier

### Future (Scale)
- CDN for static assets
- Database read replicas
- Redis cache layer
- Webhook processing via Edge Functions
- Separate analytics DB
