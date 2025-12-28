import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

// Client for public operations (with RLS)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Admin client for server operations (bypasses RLS)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types
export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  category_slug: string;
  price: number;
  images: string[];
  brand: string;
  sizes: string[];
  is_featured: boolean;
  is_popular: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  filters: {
    brands?: string[];
    teams?: string[];
    nationalTeams?: string[];
  };
  created_at: string;
}

export interface DbCart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DbCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string;
  created_at: string;
}

export interface DbOrder {
  id: string;
  user_id: string;
  items: DbCartItem[];
  total_amount: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

