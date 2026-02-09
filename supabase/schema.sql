-- Quickly - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE card_status AS ENUM ('in_stock', 'assigned', 'disabled');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');
CREATE TYPE template_id AS ENUM ('classic', 'card', 'split');

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'client',
    full_name TEXT,
    username TEXT UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    template_id template_id DEFAULT 'classic',
    theme_json JSONB DEFAULT '{
        "bgType": "gradient",
        "bg1": "#0B0F1A",
        "bg2": "#1F2937",
        "primary": "#D4AF37",
        "text": "#FFFFFF",
        "radius": "lg",
        "font": "inter"
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    contact_email TEXT,
    contact_phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links (client's link-in-bio buttons)
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT, -- Icon name or emoji
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    clicks_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards (NFC/QR inventory)
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_uid TEXT UNIQUE NOT NULL, -- Unique identifier on physical card
    status card_status DEFAULT 'in_stock',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Card Activations (activation codes)
CREATE TABLE card_activations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    activation_code TEXT UNIQUE NOT NULL, -- Code printed on card packaging
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (card types for sale)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    images TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT true,
    stock_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    status order_status DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT, -- 'cod' or 'whatsapp'
    shipping_address TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates (for future expansion)
CREATE TABLE templates (
    id TEXT PRIMARY KEY, -- 'classic', 'card', 'split'
    name TEXT NOT NULL,
    description TEXT,
    preview_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Views (analytics)
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    referrer TEXT,
    country TEXT,
    user_agent TEXT
);

-- Link Clicks (analytics)
CREATE TABLE link_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    referrer TEXT
);

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_sort_order ON links(user_id, sort_order);
CREATE INDEX idx_cards_card_uid ON cards(card_uid);
CREATE INDEX idx_cards_assigned_to ON cards(assigned_to);
CREATE INDEX idx_card_activations_code ON card_activations(activation_code);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_clicked_at ON link_clicks(clicked_at);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin'
        FROM profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PROFILES RLS POLICIES
-- ============================================================================

-- Public can read active profiles (for public pages)
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (is_active = true);

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins have full access to profiles"
    ON profiles FOR ALL
    USING (is_admin());

-- ============================================================================
-- LINKS RLS POLICIES
-- ============================================================================

-- Public can read active links from active profiles
CREATE POLICY "Public can view active links"
    ON links FOR SELECT
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = links.user_id
            AND profiles.is_active = true
        )
    );

-- Users can CRUD their own links
CREATE POLICY "Users can manage own links"
    ON links FOR ALL
    USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins have full access to links"
    ON links FOR ALL
    USING (is_admin());

-- ============================================================================
-- CARDS RLS POLICIES
-- ============================================================================

-- Users can view cards assigned to them
CREATE POLICY "Users can view own cards"
    ON cards FOR SELECT
    USING (auth.uid() = assigned_to);

-- Admins can do everything
CREATE POLICY "Admins have full access to cards"
    ON cards FOR ALL
    USING (is_admin());

-- ============================================================================
-- CARD_ACTIVATIONS RLS POLICIES
-- ============================================================================

-- Users can view their own activations
CREATE POLICY "Users can view own activations"
    ON card_activations FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert activations (for activation flow)
CREATE POLICY "Users can activate cards"
    ON card_activations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins have full access to activations"
    ON card_activations FOR ALL
    USING (is_admin());

-- ============================================================================
-- PRODUCTS RLS POLICIES
-- ============================================================================

-- Everyone can view active products
CREATE POLICY "Active products are viewable by everyone"
    ON products FOR SELECT
    USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins have full access to products"
    ON products FOR ALL
    USING (is_admin());

-- ============================================================================
-- ORDERS RLS POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins have full access to orders"
    ON orders FOR ALL
    USING (is_admin());

-- ============================================================================
-- TEMPLATES RLS POLICIES
-- ============================================================================

-- Everyone can view active templates
CREATE POLICY "Active templates are viewable by everyone"
    ON templates FOR SELECT
    USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins have full access to templates"
    ON templates FOR ALL
    USING (is_admin());

-- ============================================================================
-- PAGE_VIEWS RLS POLICIES
-- ============================================================================

-- Users can view their own analytics
CREATE POLICY "Users can view own page views"
    ON page_views FOR SELECT
    USING (auth.uid() = user_id);

-- Anyone can insert page views (tracking)
CREATE POLICY "Anyone can log page views"
    ON page_views FOR INSERT
    WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "Admins have full access to page views"
    ON page_views FOR ALL
    USING (is_admin());

-- ============================================================================
-- LINK_CLICKS RLS POLICIES
-- ============================================================================

-- Users can view their own link clicks
CREATE POLICY "Users can view own link clicks"
    ON link_clicks FOR SELECT
    USING (auth.uid() = user_id);

-- Anyone can insert link clicks (tracking)
CREATE POLICY "Anyone can log link clicks"
    ON link_clicks FOR INSERT
    WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "Admins have full access to link clicks"
    ON link_clicks FOR ALL
    USING (is_admin());

-- ============================================================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name)
    VALUES (
        NEW.id,
        'client',
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. SEED DATA (Templates)
-- ============================================================================

INSERT INTO templates (id, name, description, is_active) VALUES
    ('classic', 'Classic', 'Simple centered layout with stacked buttons', true),
    ('card', 'Card', 'Card-based sections with subtle shadows', true),
    ('split', 'Split', 'Header banner with content area for brand feel', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. INITIAL ADMIN USER
-- ============================================================================
-- After creating your first user via Supabase Auth, run this to make them admin:
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
