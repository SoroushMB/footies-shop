-- Supabase Database Schema for Footies-Shop
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  category_slug VARCHAR(100) NOT NULL REFERENCES categories(slug),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  images TEXT[] NOT NULL DEFAULT '{}',
  brand VARCHAR(100) NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(200),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, product_id, size)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_intent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_popular ON products(is_popular) WHERE is_popular = TRUE;
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories
CREATE POLICY "Public read access for products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public read access for categories" ON categories
  FOR SELECT USING (true);

-- Service role has full access (for backend operations)
CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to carts" ON carts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to cart_items" ON cart_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- Insert sample data
INSERT INTO categories (name, slug, description, filters) VALUES
  ('Jerseys', 'jerseys', 'Official and replica football jerseys from top clubs and national teams', '{"brands": ["Nike", "Adidas", "Puma"], "teams": ["Manchester United", "Barcelona", "Real Madrid"], "nationalTeams": ["Brazil", "Argentina", "Germany"]}'),
  ('Footballs', 'footballs', 'Match balls, training balls, and recreational footballs', '{"brands": ["Adidas", "Nike", "Puma", "Select"]}'),
  ('Footwear', 'footwear', 'Football boots, indoor shoes, and training footwear', '{"brands": ["Nike", "Adidas", "Puma", "New Balance"]}'),
  ('Apparel', 'apparel', 'Training gear, jackets, shorts, and more', '{"brands": ["Nike", "Adidas", "Under Armour"]}'),
  ('Accessories', 'accessories', 'Gloves, shin guards, bags, and other essentials', '{"brands": ["Nike", "Adidas", "Reusch"]}')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (slug, name, description, category, category_slug, price, images, brand, sizes, is_featured, is_popular, stock) VALUES
  ('nike-mercurial-superfly-9', 'Nike Mercurial Superfly 9 Elite', 'Experience explosive speed with the Nike Mercurial Superfly 9 Elite. Featuring Zoom Air technology and an aerodynamic design for maximum acceleration.', 'Footwear', 'footwear', 274.99, ARRAY['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'], 'Nike', ARRAY['7', '8', '9', '10', '11', '12'], TRUE, TRUE, 50),
  ('adidas-predator-edge', 'Adidas Predator Edge+', 'Dominate the game with the Adidas Predator Edge+. Zone Skin technology provides unparalleled ball control and swerve.', 'Footwear', 'footwear', 249.99, ARRAY['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800'], 'Adidas', ARRAY['6', '7', '8', '9', '10', '11'], TRUE, FALSE, 35),
  ('manchester-united-home-23-24', 'Manchester United Home Jersey 23/24', 'Show your support with the official Manchester United home jersey. Made with AEROREADY technology for moisture-wicking comfort.', 'Jerseys', 'jerseys', 89.99, ARRAY['https://images.unsplash.com/photo-1577212017308-84f23ebb17a9?w=800'], 'Adidas', ARRAY['S', 'M', 'L', 'XL', 'XXL'], TRUE, TRUE, 100),
  ('barcelona-away-23-24', 'FC Barcelona Away Jersey 23/24', 'The iconic Barcelona away kit. Nike Dri-FIT technology keeps you cool and comfortable.', 'Jerseys', 'jerseys', 94.99, ARRAY['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'], 'Nike', ARRAY['S', 'M', 'L', 'XL'], FALSE, TRUE, 75),
  ('adidas-al-rihla-pro', 'Adidas Al Rihla Pro Match Ball', 'The official 2022 World Cup match ball. Seamless surface for accurate flight and water resistance.', 'Footballs', 'footballs', 149.99, ARRAY['https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800'], 'Adidas', ARRAY['5'], TRUE, TRUE, 40),
  ('nike-flight-premier-league', 'Nike Flight Premier League Ball', 'The official Premier League match ball. AerowSculpt technology for true flight and consistent performance.', 'Footballs', 'footballs', 159.99, ARRAY['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800'], 'Nike', ARRAY['5'], FALSE, TRUE, 30),
  ('nike-dri-fit-training-jacket', 'Nike Dri-FIT Academy Training Jacket', 'Stay warm during training sessions with this lightweight, breathable jacket featuring Dri-FIT technology.', 'Apparel', 'apparel', 64.99, ARRAY['https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800'], 'Nike', ARRAY['S', 'M', 'L', 'XL', 'XXL'], FALSE, FALSE, 60),
  ('adidas-tiro-training-pants', 'Adidas Tiro 23 Training Pants', 'Classic training pants with AEROREADY technology. Perfect for practice and casual wear.', 'Apparel', 'apparel', 49.99, ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800'], 'Adidas', ARRAY['S', 'M', 'L', 'XL'], FALSE, TRUE, 80),
  ('nike-mercurial-shin-guards', 'Nike Mercurial Lite Shin Guards', 'Low-profile protection with anatomical design. Durable shell with foam backing for comfort.', 'Accessories', 'accessories', 24.99, ARRAY['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'], 'Nike', ARRAY['S', 'M', 'L'], FALSE, FALSE, 120),
  ('adidas-predator-gloves', 'Adidas Predator Training Gloves', 'Entry-level goalkeeper gloves with excellent grip and finger protection. Perfect for training sessions.', 'Accessories', 'accessories', 39.99, ARRAY['https://images.unsplash.com/photo-1550259114-ad7188f0a967?w=800'], 'Adidas', ARRAY['7', '8', '9', '10', '11'], FALSE, FALSE, 45)
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;
CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

