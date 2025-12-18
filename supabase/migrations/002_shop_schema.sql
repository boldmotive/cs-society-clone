-- =============================================
-- SHOP PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spreadconnect_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on shop_products
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view active products" ON shop_products
  FOR SELECT USING (is_active = true);

-- Admin write access
CREATE POLICY "Admins can manage products" ON shop_products
  FOR ALL USING (is_admin());

-- =============================================
-- SHOP PRODUCT VARIANTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS shop_product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES shop_products(id) ON DELETE CASCADE,
  spreadconnect_sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  appearance_id TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on shop_product_variants
ALTER TABLE shop_product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access for available variants
CREATE POLICY "Anyone can view available variants" ON shop_product_variants
  FOR SELECT USING (is_available = true);

-- Admin write access
CREATE POLICY "Admins can manage variants" ON shop_product_variants
  FOR ALL USING (is_admin());

-- =============================================
-- SHOP ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS shop_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  spreadconnect_order_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'submitted', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  tracking_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on shop_orders
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders" ON shop_orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON shop_orders
  FOR SELECT USING (is_admin());

-- Service role can manage orders (for webhooks)
CREATE POLICY "Service role can manage orders" ON shop_orders
  FOR ALL TO service_role USING (true);

-- =============================================
-- SHOP ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS shop_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES shop_products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES shop_product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  spreadconnect_sku TEXT NOT NULL,
  product_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on shop_order_items
ALTER TABLE shop_order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items from their own orders
CREATE POLICY "Users can view their own order items" ON shop_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shop_orders
      WHERE shop_orders.id = shop_order_items.order_id
      AND shop_orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON shop_order_items
  FOR SELECT USING (is_admin());

-- Service role can manage order items (for webhooks)
CREATE POLICY "Service role can manage order items" ON shop_order_items
  FOR ALL TO service_role USING (true);

-- =============================================
-- SHOP SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS shop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  markup_percentage DECIMAL NOT NULL DEFAULT 0.30,
  -- Note: SpreadConnect API credentials are stored in environment variables
  -- for security, not in the database
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_by UUID REFERENCES profiles(id)
);

-- Enable RLS on shop_settings
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can access settings
CREATE POLICY "Admins can manage settings" ON shop_settings
  FOR ALL USING (is_admin());

-- Insert default settings row
INSERT INTO shop_settings (markup_percentage) VALUES (0.30)
ON CONFLICT DO NOTHING;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_shop_products_spreadconnect_id ON shop_products(spreadconnect_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_shop_product_variants_product_id ON shop_product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_shop_product_variants_sku ON shop_product_variants(spreadconnect_sku);
CREATE INDEX IF NOT EXISTS idx_shop_orders_user_id ON shop_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON shop_orders(status);
CREATE INDEX IF NOT EXISTS idx_shop_orders_stripe_session ON shop_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_spreadconnect_id ON shop_orders(spreadconnect_order_id);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order_id ON shop_order_items(order_id);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTIONS
-- =============================================
CREATE OR REPLACE FUNCTION update_shop_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
DROP TRIGGER IF EXISTS update_shop_products_updated_at ON shop_products;
CREATE TRIGGER update_shop_products_updated_at
  BEFORE UPDATE ON shop_products
  FOR EACH ROW EXECUTE FUNCTION update_shop_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_product_variants_updated_at ON shop_product_variants;
CREATE TRIGGER update_shop_product_variants_updated_at
  BEFORE UPDATE ON shop_product_variants
  FOR EACH ROW EXECUTE FUNCTION update_shop_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_orders_updated_at ON shop_orders;
CREATE TRIGGER update_shop_orders_updated_at
  BEFORE UPDATE ON shop_orders
  FOR EACH ROW EXECUTE FUNCTION update_shop_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_settings_updated_at ON shop_settings;
CREATE TRIGGER update_shop_settings_updated_at
  BEFORE UPDATE ON shop_settings
  FOR EACH ROW EXECUTE FUNCTION update_shop_updated_at_column();
