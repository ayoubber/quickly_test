# Quickly - NFC & QR Social Cards Platform

Premium SaaS platform for NFC & QR social cards with link-in-bio functionality.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Hosting**: Vercel


## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install


### 3. Setup Database

In Supabase SQL Editor, run:
1. `supabase/schema.sql` - Creates tables and RLS policies
2. `supabase/seed.sql` - Adds demo data (optional)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Features

### Marketing
- Home page with hero and features
- Store with product catalog
- Services showcase
- How It Works guide (NFC/QR instructions)
- Pricing plans
- Contact form

### Client Dashboard
- Profile editor with theme builder
- Links management (CRUD)
- Card activation
- Analytics dashboard
- Account settings

### Admin Panel
- System overview
- Orders management
- Products CRUD
- Card inventory
- Clients management

### Public Profiles
- 3 templates: Classic, Card, Split
- Customizable themes (colors, fonts, gradients)
- Mobile-optimized for scanning
- Click tracking

## 🎨 Templates

| Template | Description |
|----------|-------------|
| Classic  | Centered layout with stacked buttons |
| Card     | Card-based sections with shadows |
| Split    | Header banner with brand feel |

## 🔐 Security

- Row Level Security (RLS) on all tables
- Role-based access (admin/client)
- Input validation and URL sanitization
- XSS prevention

## 💳 Payment Flow

1. Customer orders via Store page
2. Contact via WhatsApp for payment
3. Admin marks order as paid
4. Card assigned to customer
5. Customer activates with code

## 📊 Database Tables

- `profiles` - User data, theme, template
- `links` - User's link buttons
- `cards` - NFC/QR card inventory
- `card_activations` - Activation codes
- `products` - Card products
- `orders` - Purchase records
- `page_views` - Profile analytics
- `link_clicks` - Click tracking

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## ✅ Production Checklist

- [ ] Enable Supabase RLS
- [ ] Setup custom domain
- [ ] Configure email templates
- [ ] Enable database backups
- [ ] Setup error monitoring
- [ ] Add rate limiting
- [ ] Configure analytics

## 📄 License

MIT License
