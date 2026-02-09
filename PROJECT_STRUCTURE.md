# Quickly - Next.js Project Structure

```
quickly-saas/
├── .env.local.example          # Environment variables template
├── .env.local                  # Local environment (gitignored)
├── .gitignore
├── next.config.js              # Next.js configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── README.md
├── ARCHITECTURE.md
│
├── supabase/
│   ├── schema.sql              # Database schema with RLS
│   ├── seed.sql                # Demo data
│   └── migrations/             # Future migrations
│
├── public/
│   ├── logo.svg
│   ├── icons/                  # Social media icons
│   └── templates/              # Template preview images
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   │
│   │   ├── (marketing)/        # Marketing pages group
│   │   │   ├── layout.tsx      # Marketing layout (header/footer)
│   │   │   ├── page.tsx        # Home (redirects or shows home)
│   │   │   ├── store/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── how-it-works/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── auth/               # Auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/          # Client dashboard
│   │   │   ├── layout.tsx      # Dashboard layout (sidebar)
│   │   │   ├── page.tsx        # Overview
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── links/
│   │   │   │   └── page.tsx
│   │   │   ├── cards/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── layout.tsx      # Admin layout
│   │   │   ├── page.tsx        # Overview
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   └── page.tsx
│   │   │   ├── cards/
│   │   │   │   └── page.tsx
│   │   │   ├── clients/
│   │   │   │   └── page.tsx
│   │   │   └── support/
│   │   │       └── page.tsx
│   │   │
│   │   ├── u/                  # Public profiles
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # SSR profile page
│   │   │
│   │   ├── c/                  # Card UID redirect
│   │   │   └── [uid]/
│   │   │       └── page.tsx    # Redirect to /u/[slug]
│   │   │
│   │   └── api/                # API routes
│   │       ├── track-view/
│   │       │   └── route.ts
│   │       ├── track-click/
│   │       │   └── route.ts
│   │       └── upload/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── marketing/          # Marketing components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── hero.tsx
│   │   │   └── features.tsx
│   │   │
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── sidebar.tsx
│   │   │   ├── nav.tsx
│   │   │   └── stats-card.tsx
│   │   │
│   │   ├── admin/              # Admin components
│   │   │   ├── sidebar.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── profile/            # Public profile components
│   │   │   ├── templates/
│   │   │   │   ├── classic.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── split.tsx
│   │   │   ├── link-button.tsx
│   │   │   ├── social-icons.tsx
│   │   │   └── share-button.tsx
│   │   │
│   │   ├── theme/              # Theme builder components
│   │   │   ├── template-selector.tsx
│   │   │   ├── color-picker.tsx
│   │   │   ├── theme-preview.tsx
│   │   │   └── background-selector.tsx
│   │   │
│   │   └── forms/              # Form components
│   │       ├── link-form.tsx
│   │       ├── profile-form.tsx
│   │       └── activation-form.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Client-side Supabase
│   │   │   ├── server.ts       # Server-side Supabase
│   │   │   └── middleware.ts   # Middleware Supabase
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts           # Tailwind merge
│   │   │   ├── validators.ts   # URL validation
│   │   │   └── sanitize.ts     # XSS prevention
│   │   │
│   │   └── constants/
│   │       ├── social-icons.ts
│   │       └── templates.ts
│   │
│   ├── actions/                # Server Actions
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── links.ts
│   │   ├── cards.ts
│   │   ├── admin.ts
│   │   └── analytics.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-user.ts
│   │   ├── use-profile.ts
│   │   ├── use-links.ts
│   │   └── use-theme.ts
│   │
│   └── types/
│       ├── database.ts         # Generated from Supabase
│       ├── profile.ts
│       ├── link.ts
│       └── theme.ts
│
└── scripts/
    ├── generate-types.sh       # Generate TS types from Supabase
    └── seed.ts                 # Seed demo data
```

## Route Map

### Marketing Routes (Public)
- `/` - Home page
- `/store` - Product catalog
- `/services` - Services page
- `/how-it-works` - Guide (NFC activation, QR scanning)
- `/pricing` - Pricing plans (optional)
- `/contact` - Contact form (optional)

### Auth Routes (Public)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Password reset

### Client Routes (Protected)
- `/dashboard` - Client overview (stats, recent activity)
- `/dashboard/profile` - Edit public profile (theme, template, bio)
- `/dashboard/links` - Manage links (CRUD, reorder, toggle)
- `/dashboard/cards` - View owned cards, activate new card
- `/dashboard/analytics` - View page views & link clicks
- `/dashboard/settings` - Account settings

### Admin Routes (Protected - Admin Only)
- `/admin` - Admin overview (system stats)
- `/admin/orders` - Manage orders
- `/admin/products` - Manage products (CRUD)
- `/admin/cards` - Card inventory & assignment
- `/admin/clients` - View/manage clients
- `/admin/support` - Support tickets (optional)

### Public Profile Routes (Public - SSR)
- `/u/[slug]` - Public profile page (scan/tap destination)
- `/c/[uid]` - Card UID → redirects to `/u/[slug]`

### API Routes
- `/api/track-view` - Log page view
- `/api/track-click` - Log link click
- `/api/upload` - File upload (avatar, background)

## Component Naming Convention

- UI components: lowercase-kebab (button.tsx, input.tsx)
- Feature components: PascalCase (ProfileForm.tsx, ThemeBuilder.tsx)
- Layout components: lowercase-kebab (header.tsx, sidebar.tsx)

## State Management

- Server Components: Default for data fetching
- Client Components: For interactivity (use "use client")
- Server Actions: For mutations
- React hooks: For client state (useState, useEffect)
- No external state library needed for MVP

## Styling Strategy

- Tailwind CSS for all styling
- CSS variables for theme colors
- Dynamic classes via theme_json
- No CSS modules or styled-components
- Responsive: mobile-first

## Data Fetching Pattern

```typescript
// Server Component (default)
async function Page() {
  const data = await fetchData(); // Direct DB call
  return <Component data={data} />;
}

// Client Component with Server Action
'use client';
function Component() {
  async function handleSubmit() {
    await serverAction(data);
  }
  return <form action={handleSubmit}>...</form>;
}
```
