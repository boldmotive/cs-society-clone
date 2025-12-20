-- =============================================
-- SHOP SCHEMA ENHANCEMENTS
-- Add support for:
-- 1. Color hex values for visual swatches
-- 2. Multiple product images
-- =============================================

-- Add color_hex column to shop_product_variants
ALTER TABLE shop_product_variants
ADD COLUMN IF NOT EXISTS color_hex TEXT;

-- Comment on new column
COMMENT ON COLUMN shop_product_variants.color_hex IS 'Hex color code for visual color swatches, e.g. #000000';

-- =============================================
-- SHOP PRODUCT IMAGES TABLE
-- Store multiple images per product with perspective info
-- =============================================
CREATE TABLE IF NOT EXISTS shop_product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES shop_products(id) ON DELETE CASCADE,
  spreadconnect_image_id TEXT,
  image_url TEXT NOT NULL,
  perspective TEXT DEFAULT 'front', -- front, back, detail, etc.
  appearance_id TEXT,
  appearance_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on shop_product_images
ALTER TABLE shop_product_images ENABLE ROW LEVEL SECURITY;

-- Public read access for product images
CREATE POLICY "Anyone can view product images" ON shop_product_images
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage product images" ON shop_product_images
  FOR ALL USING (is_admin());

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_shop_product_images_product_id ON shop_product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_shop_product_images_appearance ON shop_product_images(appearance_id);

