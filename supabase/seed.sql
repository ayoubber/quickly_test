-- Seed script for Quickly demo data
-- Run this after schema.sql to populate demo data

-- Insert test templates
INSERT INTO public.templates (id, name, description, is_active) VALUES
  ('classic', 'Classic', 'Simple centered layout with stacked buttons', true),
  ('card', 'Card', 'Card-based sections with subtle shadows', true),
  ('split', 'Split', 'Header banner with content area for a brand feel', true)
ON CONFLICT (id) DO NOTHING;

-- Insert demo products
INSERT INTO public.products (id, name, description, price, is_active) VALUES
  (gen_random_uuid(), 'Classic Black', 'Elegant matte black NFC card with gold accent', 4500, true),
  (gen_random_uuid(), 'Premium Gold', 'Luxurious gold finish with brushed metal texture', 6500, true),
  (gen_random_uuid(), 'Holographic', 'Eye-catching holographic design that stands out', 5500, true),
  (gen_random_uuid(), 'Custom Design', 'Your brand, your design, your way', 8000, true);

-- Insert demo cards (not assigned - in stock)
INSERT INTO public.cards (id, card_uid, status) VALUES
  (gen_random_uuid(), 'QUICKLY-001', 'in_stock'),
  (gen_random_uuid(), 'QUICKLY-002', 'in_stock'),
  (gen_random_uuid(), 'QUICKLY-003', 'in_stock'),
  (gen_random_uuid(), 'QUICKLY-004', 'in_stock'),
  (gen_random_uuid(), 'QUICKLY-005', 'in_stock');

-- Insert activation codes for demo cards
INSERT INTO public.card_activations (id, card_id, activation_code)
SELECT 
  gen_random_uuid(),
  id,
  'ACT-' || UPPER(SUBSTRING(card_uid FROM 9))
FROM public.cards 
WHERE status = 'in_stock';

-- Note: To create an admin user, after signing up normally, run:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';

-- Or create a trigger to make the first user an admin:
/*
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.profiles) = 1 THEN
    UPDATE public.profiles SET role = 'admin' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_first_user_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.make_first_user_admin();
*/

-- Demo profile theme example (for reference)
-- theme_json should look like:
-- {
--   "bgType": "gradient",
--   "bg1": "#0B0F1A",
--   "bg2": "#1F2937",
--   "primary": "#D4AF37",
--   "text": "#FFFFFF",
--   "radius": "lg",
--   "font": "inter"
-- }
