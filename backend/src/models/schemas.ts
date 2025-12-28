import { z } from 'zod';

// Product schemas
export const ProductSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  description: z.string().max(5000),
  category: z.string().min(1).max(100),
  categorySlug: z.string().min(1).max(100),
  price: z.number().positive().max(100000),
  images: z.array(z.string().url()).min(1).max(10),
  brand: z.string().min(1).max(100),
  sizes: z.array(z.string()).min(1),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  stock: z.number().int().min(0).default(0),
});

export type Product = z.infer<typeof ProductSchema>;

// Category schemas
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
  filters: z.object({
    brands: z.array(z.string()).optional(),
    teams: z.array(z.string()).optional(),
    nationalTeams: z.array(z.string()).optional(),
  }).optional(),
});

export type Category = z.infer<typeof CategorySchema>;

// Cart schemas
export const CartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
  price: z.number().positive(),
  size: z.string().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
  size: z.string().optional(),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(100),
});

// Order schemas
export const ShippingAddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zip: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const OrderStatusSchema = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const CheckoutSchema = z.object({
  shippingAddress: ShippingAddressSchema,
});

// User schemas
export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  shippingAddress: ShippingAddressSchema.optional(),
});

// Query schemas
export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().max(200).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().max(100000).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// AI schemas
export const ProductSuggestionRequestSchema = z.object({
  currentProductId: z.string().uuid(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(50).optional(),
});

