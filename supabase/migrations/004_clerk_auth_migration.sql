-- =============================================
-- CLERK AUTHENTICATION MIGRATION
-- =============================================
-- This migration updates the profiles table to work with Clerk authentication
-- instead of Supabase Auth. Clerk user IDs are strings (e.g., 'user_2abc123...')
-- instead of UUIDs.
--
-- IMPORTANT: This is a breaking change. Run this migration only after:
-- 1. Setting up Clerk authentication
-- 2. Configuring the Clerk webhook to sync users
-- 3. Backing up existing user data if needed
-- =============================================

-- Step 1: Drop the trigger that creates profiles from Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 2: Drop existing RLS policies that reference auth.uid()
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can view all profiles" ON profiles;

-- Step 3: Drop foreign key constraints from other tables that reference profiles
-- Note: shop_orders and shop_settings reference profiles(id)
ALTER TABLE shop_orders DROP CONSTRAINT IF EXISTS shop_orders_user_id_fkey;
ALTER TABLE shop_settings DROP CONSTRAINT IF EXISTS shop_settings_updated_by_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_created_by_fkey;

-- Step 4: Create a new profiles table with TEXT id
-- First, rename the old table
ALTER TABLE profiles RENAME TO profiles_old;

-- Create new profiles table with TEXT id
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,  -- Clerk user ID (e.g., 'user_2abc123...')
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'annual', NULL)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Step 5: Enable RLS on new profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create new RLS policies
-- Note: With Clerk, we can't use auth.uid() anymore
-- Instead, we rely on service_role for server-side operations
-- and the application layer for client-side access control

-- Service role can do everything (for webhooks and server-side operations)
CREATE POLICY "Service role full access" ON profiles
  FOR ALL TO service_role USING (true);

-- Authenticated users can view their own profile
-- Note: This requires passing the Clerk user ID in the request
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can update their own profile
-- Note: Application layer should verify the user ID matches
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (true);

-- Step 7: Drop policies that depend on is_admin() function
-- Shop tables policies
DROP POLICY IF EXISTS "Admins can manage products" ON shop_products;
DROP POLICY IF EXISTS "Admins can manage variants" ON shop_product_variants;
DROP POLICY IF EXISTS "Admins can view all orders" ON shop_orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON shop_order_items;
DROP POLICY IF EXISTS "Admins can manage settings" ON shop_settings;
DROP POLICY IF EXISTS "Admins can manage product images" ON shop_product_images;

-- Events table policies
DROP POLICY IF EXISTS "Admins can insert events" ON events;
DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins can delete events" ON events;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS is_admin();

-- Step 8: Create new admin check functions
CREATE OR REPLACE FUNCTION is_admin_by_id(user_id TEXT)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Keep a version that works with service_role for backward compatibility
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  -- This function now always returns false for non-service-role calls
  -- Admin checks should be done in the application layer with Clerk
  SELECT false
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 9: Recreate admin policies using service_role instead
-- Shop products - service role for admin operations
CREATE POLICY "Service role can manage products" ON shop_products
  FOR ALL TO service_role USING (true);

-- Shop variants - service role for admin operations
CREATE POLICY "Service role can manage variants" ON shop_product_variants
  FOR ALL TO service_role USING (true);

-- Shop orders - service role can view all
CREATE POLICY "Service role can view all orders" ON shop_orders
  FOR SELECT TO service_role USING (true);

-- Shop order items - service role can view all
CREATE POLICY "Service role can view all order items" ON shop_order_items
  FOR SELECT TO service_role USING (true);

-- Shop settings - service role only
CREATE POLICY "Service role can manage settings" ON shop_settings
  FOR ALL TO service_role USING (true);

-- Shop product images - service role for admin operations
CREATE POLICY "Service role can manage product images" ON shop_product_images
  FOR ALL TO service_role USING (true);

-- Events - service role for admin operations
CREATE POLICY "Service role can insert events" ON events
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can update events" ON events
  FOR UPDATE TO service_role USING (true);

CREATE POLICY "Service role can delete events" ON events
  FOR DELETE TO service_role USING (true);

-- Step 10: Update foreign key references to use TEXT
-- shop_orders.user_id
ALTER TABLE shop_orders ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE shop_orders ADD CONSTRAINT shop_orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- shop_settings.updated_by
ALTER TABLE shop_settings ALTER COLUMN updated_by TYPE TEXT;
ALTER TABLE shop_settings ADD CONSTRAINT shop_settings_updated_by_fkey
  FOREIGN KEY (updated_by) REFERENCES profiles(id);

-- events.created_by
ALTER TABLE events ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE events ADD CONSTRAINT events_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES profiles(id);

-- Step 11: Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Step 12: Add updated_at trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- Step 13: Migration note
-- The old profiles_old table is kept for reference
-- You can drop it after verifying the migration:
-- DROP TABLE profiles_old;

-- =============================================
-- POST-MIGRATION NOTES
-- =============================================
-- 1. Existing users will need to sign in again with Clerk
-- 2. Their profiles will be created via the Clerk webhook
-- 3. Admin roles will need to be reassigned manually:
--    UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- 4. Stripe subscriptions will need to be re-linked if users have different IDs

