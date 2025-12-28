/**
 * API client for communicating with the Express.js backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  token?: string;
  cache?: RequestCache;
  revalidate?: number;
}

/**
 * Make an API request to the backend
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token, cache, revalidate } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Product types
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  price: number;
  images: string[];
  brand: string;
  sizes: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  filters?: {
    brands?: string[];
    teams?: string[];
    nationalTeams?: string[];
  };
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  shippingAddress?: ShippingAddress;
}

// Products API
export const productsApi = {
  getAll: async (params?: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiRequest<Product[]>(`/api/products${query ? `?${query}` : ''}`, {
      revalidate: 60,
    });
  },

  getById: async (id: string) => {
    return apiRequest<Product>(`/api/products/${id}`, { revalidate: 60 });
  },

  getFeatured: async () => {
    return apiRequest<Product[]>('/api/products/featured', { revalidate: 300 });
  },

  getPopular: async () => {
    return apiRequest<Product[]>('/api/products/popular', { revalidate: 300 });
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    return apiRequest<Category[]>('/api/categories', { revalidate: 600 });
  },

  getBySlug: async (slug: string) => {
    return apiRequest<{ category: Category; products: Product[] }>(
      `/api/categories/${slug}`,
      { revalidate: 60 }
    );
  },
};

// Cart API
export const cartApi = {
  get: async (token: string) => {
    return apiRequest<Cart>('/api/cart', { token });
  },

  addItem: async (token: string, productId: string, quantity: number, size?: string) => {
    return apiRequest<void>('/api/cart', {
      method: 'POST',
      token,
      body: { productId, quantity, size },
    });
  },

  updateItem: async (token: string, itemId: string, quantity: number) => {
    return apiRequest<void>(`/api/cart/${itemId}`, {
      method: 'PUT',
      token,
      body: { quantity },
    });
  },

  removeItem: async (token: string, itemId: string) => {
    return apiRequest<void>(`/api/cart/${itemId}`, {
      method: 'DELETE',
      token,
    });
  },
};

// Checkout API
export const checkoutApi = {
  process: async (token: string, shippingAddress: ShippingAddress) => {
    return apiRequest<{ orderId: string; totalAmount: number; status: string }>(
      '/api/checkout',
      {
        method: 'POST',
        token,
        body: { shippingAddress },
      }
    );
  },

  getOrders: async (token: string) => {
    return apiRequest<Order[]>('/api/checkout/orders', { token });
  },

  getOrder: async (token: string, orderId: string) => {
    return apiRequest<Order>(`/api/checkout/orders/${orderId}`, { token });
  },
};

// Users API
export const usersApi = {
  getMe: async (token: string) => {
    return apiRequest<User>('/api/users/me', { token });
  },

  updateMe: async (token: string, data: { name?: string; shippingAddress?: ShippingAddress }) => {
    return apiRequest<User>('/api/users/me', {
      method: 'PUT',
      token,
      body: data,
    });
  },
};

// AI API
export const aiApi = {
  getSuggestions: async (productId: string, token?: string) => {
    return apiRequest<{ suggestions: Product[]; reasoning: string }>(
      '/api/ai/suggestions',
      {
        method: 'POST',
        token,
        body: { currentProductId: productId },
      }
    );
  },

  chat: async (message: string, conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    return apiRequest<{ response: string }>('/api/ai/chat', {
      method: 'POST',
      body: { message, conversationHistory },
    });
  },
};

