# Quickly - NFC & QR Social Cards Platform

A production-ready SaaS platform for NFC and QR social cards with customizable link-in-bio pages.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Vercel account (for deployment)

### Local Development Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Setup Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy your project URL and anon key
   - Run the SQL in `supabase/schema.sql` in Supabase SQL Editor
   - Create a storage bucket named `public` (make it public)

3. **Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

5. **Create First Admin User**
   - Sign up through the UI
   - Get your user UUID from Supabase Auth dashboard
   - Run in Supabase SQL Editor:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
     ```

## 📁 Project Structure

```
quickly-saas/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (marketing)/   # Marketing pages (home, store, etc.)
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Client dashboard
│   │   ├── admin/         # Admin dashboard
│   │   ├── u/[slug]/      # Public profiles (SSR)
│   │   └── api/           # API routes
│   │
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── profile/       # Public profile templates
│   │   └── theme/         # Theme builder components
│   │
│   ├── lib/
│   │   ├── supabase/      # Supabase clients
│   │   └── utils/         # Utility functions
│   │
│   ├── actions/           # Server Actions
│   └── types/             # TypeScript types
│
├── supabase/              # Database schema and migrations
└── public/                # Static assets
```

## 🗄️ Database Schema

### Core Tables

- **profiles** - User profiles with theme/template settings
- **links** - Client's link-in-bio buttons
- **cards** - NFC/QR card inventory
- **card_activations** - Activation codes
- **products** - Card types for sale
- **orders** - Purchase records
- **templates** - Theme templates
- **page_views** - Analytics (views)
- **link_clicks** - Analytics (clicks)

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Clients**: Can only access their own data
- **Admins**: Can access all data
- **Visitors**: Can only view public, active profiles

## 🎨 Features

### For Clients

1. **Profile Management**
   - Choose username (e.g., `/u/johndoe`)
   - Upload avatar
   - Add bio, contact info, location
   - Select template (Classic, Card, Split)
   - Customize theme (colors, fonts, layout)

2. **Link Management**
   - Add unlimited links
   - Drag-and-drop reordering
   - Toggle visibility
   - Add icons/emojis
   - Track clicks

3. **Card Activation**
   - Enter activation code from card packaging
   - View owned cards
   - Multiple cards supported

4. **Analytics**
   - Profile views over time
   - Link click counts
   - Top performing links
   - Recent activity

### For Admins

1. **Order Management**
   - View all orders
   - Update order status (pending → paid → shipped → completed)
   - COD and WhatsApp payment tracking

2. **Product Management**
   - CRUD operations on card products
   - Set prices, descriptions, images
   - Manage stock

3. **Card Inventory**
   - Generate new cards with UIDs
   - Create activation codes
   - Assign cards to clients
   - Disable cards

4. **Client Management**
   - View all clients
   - Disable abusive profiles
   - View client analytics

### For Visitors

1. **Public Profiles** (`/u/[slug]`)
   - Fast SSR for SEO
   - Mobile-optimized
   - Three templates: Classic, Card, Split
   - Customizable themes
   - Social sharing

## 🎨 Template System

### Built-in Templates

1. **Classic** - Centered avatar with stacked buttons
2. **Card** - Card-based sections with shadows
3. **Split** - Header banner + content area

### Theme Customization

Clients can customize:
- Background (solid color, gradient, or image)
- Primary color (buttons)
- Text color
- Border radius (sm/md/lg)
- Font family (4 options)

Theme stored as JSON in `profiles.theme_json`:
```json
{
  "bgType": "gradient",
  "bg1": "#0B0F1A",
  "bg2": "#1F2937",
  "bgGradientAngle": 135,
  "primary": "#D4AF37",
  "text": "#FFFFFF",
  "radius": "lg",
  "font": "inter"
}
```

## 🔐 Security

### Authentication
- Supabase Auth (email/password)
- JWT tokens
- Row Level Security (RLS)
- Server-side session handling

### Data Protection
- All user input sanitized
- URL validation prevents XSS
- File upload restrictions (5MB, images only)
- HTTPS enforced in production

### Payment Security
- COD: Manual admin approval
- WhatsApp: Converted via support (manual)
- Future: Stripe integration ready

## 📊 Analytics

### Privacy-Friendly Tracking

- **Page Views**: Timestamp, referrer, country (optional)
- **Link Clicks**: Per-link tracking
- **No Personal Data**: No IP addresses, user agents stored long-term

### Data Aggregation

```typescript
// Example: Get analytics for last 30 days
const analytics = await getAnalytics('30d');
// Returns: totalViews, totalClicks, topLinks, viewsByDate
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Import project from GitHub
   - Add environment variables
   - Deploy

3. **Post-Deployment**
   - Update `NEXT_PUBLIC_APP_URL` to your domain
   - Configure custom domain in Vercel
   - Update Supabase redirect URLs

### Environment Variables (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📝 Remaining Implementation Tasks

The core structure is complete. Implement these pages:

### Marketing Pages (Priority)
1. **`/store/page.tsx`** - Product catalog with purchase flow
2. **`/services/page.tsx`** - Services information
3. **`/how-it-works/page.tsx`** - NFC activation guide (iOS/Android) + QR scanning

### Dashboard Pages
1. **`/dashboard/profile/page.tsx`** - Profile editor with theme builder
2. **`/dashboard/links/page.tsx`** - Link CRUD with drag-and-drop
3. **`/dashboard/cards/page.tsx`** - Card list + activation form
4. **`/dashboard/analytics/page.tsx`** - Charts and stats
5. **`/dashboard/settings/page.tsx`** - Account settings

### Admin Pages
1. **`/admin/page.tsx`** - Admin overview
2. **`/admin/orders/page.tsx`** - Order management
3. **`/admin/products/page.tsx`** - Product CRUD
4. **`/admin/cards/page.tsx`** - Card inventory management
5. **`/admin/clients/page.tsx`** - Client management

### Public Pages
1. **`/u/[slug]/page.tsx`** - Public profile (CRITICAL - see template examples below)
2. **`/c/[uid]/page.tsx`** - Card UID redirect

### API Routes
1. **`/api/track-view/route.ts`** - Log page view
2. **`/api/track-click/route.ts`** - Log link click
3. **`/api/upload/route.ts`** - File upload

## 🎨 Public Profile Template Examples

### Classic Template
```typescript
// components/profile/templates/classic.tsx
'use client';

import { PublicProfile } from '@/types/theme';
import Image from 'next/image';

export function ClassicTemplate({ profile, links }: PublicProfile) {
  const theme = profile.theme_json;
  
  const bgStyle = theme.bgType === 'gradient'
    ? { background: `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bg1}, ${theme.bg2})` }
    : { backgroundColor: theme.bg1 };

  return (
    <div className="min-h-screen py-12 px-6" style={bgStyle}>
      <div className="max-w-md mx-auto">
        {/* Avatar */}
        {profile.avatar_url && (
          <div className="mb-6 flex justify-center">
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || ''}
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
        )}

        {/* Name & Bio */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
            {profile.full_name}
          </h1>
          {profile.bio && (
            <p className="text-lg opacity-80" style={{ color: theme.text }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 text-center font-semibold transition hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                color: '#000',
                borderRadius: theme.radius === 'sm' ? '4px' : theme.radius === 'md' ? '8px' : '12px',
              }}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Username selection and uniqueness check
- [ ] Avatar upload
- [ ] Theme customization
- [ ] Template switching
- [ ] Link creation/editing/deletion
- [ ] Link reordering
- [ ] Card activation
- [ ] Public profile display
- [ ] Analytics tracking
- [ ] Admin product management
- [ ] Admin order management
- [ ] Admin card assignment

### Automated Testing (Future)

```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

## 🔄 Production Readiness Checklist

### Security
- [ ] All RLS policies tested
- [ ] Input validation on all forms
- [ ] XSS prevention
- [ ] HTTPS enforced
- [ ] Secrets in environment variables
- [ ] CORS configured
- [ ] Rate limiting on API routes

### Performance
- [ ] Images optimized (Next.js Image)
- [ ] Database indexes in place
- [ ] Server Components for data fetching
- [ ] Code splitting
- [ ] Lazy loading
- [ ] CDN for static assets

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics)
- [ ] Uptime monitoring
- [ ] Database performance monitoring

### Backup
- [ ] Supabase automatic backups enabled
- [ ] Regular database exports
- [ ] Storage backup strategy

### Documentation
- [ ] API documentation
- [ ] User guides (NFC activation, QR scanning)
- [ ] Admin manual
- [ ] Deployment runbook

## 📞 Support

### COD Payment Flow
1. Client places order via `/store`
2. Order created with status=`pending`, payment_method=`cod`
3. Admin reviews order in `/admin/orders`
4. Admin contacts client via phone/email
5. Upon payment, admin marks order as `paid`
6. Admin ships card, updates status to `shipped`
7. Admin adds tracking number

### WhatsApp Conversion Flow
1. Client clicks "Order via WhatsApp" button
2. Pre-filled WhatsApp message opens:
   ```
   Hi! I'd like to order [Product Name].
   Quantity: [X]
   Shipping Address: [Address]
   ```
3. Admin receives message
4. Admin manually creates order in system
5. Admin processes payment and shipping

## 🛠️ Development Tips

### Generate TypeScript Types from Supabase
```bash
npm run generate-types
```

### Seed Demo Data
```typescript
// scripts/seed.ts
// Create sample products, cards, activation codes
```

### Debug RLS Policies
```sql
-- Test as specific user
SELECT auth.uid(); -- Returns current user
SELECT * FROM profiles WHERE id = auth.uid();
```

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

Internal project - contact admin for access
