/**
 * RAG (Retrieval-Augmented Generation) Service
 *
 * This service retrieves relevant context from the knowledge base
 * to enhance AI responses with accurate, up-to-date information.
 */

import { supabaseAdmin } from './supabase.js';

interface KnowledgeBaseEntry {
  id: string;
  type: 'product' | 'policy' | 'faq' | 'category';
  title: string;
  content: string;
  keywords: string[];
  metadata?: Record<string, unknown>;
}

interface RetrievalResult {
  entries: KnowledgeBaseEntry[];
  relevanceScore: number;
}

/**
 * Store policies and FAQs knowledge base
 */
const STATIC_KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  {
    id: 'policy-shipping',
    type: 'policy',
    title: 'Shipping Policy',
    content: `Shipping Information:
- Free shipping on orders over $50
- Standard shipping: $5.00 for orders under $50
- Standard shipping takes 3-5 business days
- Express shipping available (2-3 business days) for additional fee
- International shipping available to select countries
- Orders are processed within 1-2 business days`,
    keywords: ['shipping', 'delivery', 'free shipping', 'shipping cost', 'delivery time', 'express shipping'],
  },
  {
    id: 'policy-returns',
    type: 'policy',
    title: 'Returns & Exchanges',
    content: `Returns and Exchanges:
- 30-day return policy from date of delivery
- Items must be unworn, unwashed, and in original packaging
- Size exchanges are free within 30 days
- Return shipping costs are the customer's responsibility unless item is defective
- Refunds processed within 5-7 business days after receiving returned item
- To initiate a return, contact support@footies-shop.com`,
    keywords: ['return', 'exchange', 'refund', '30 days', 'return policy', 'size exchange'],
  },
  {
    id: 'policy-sizes',
    type: 'policy',
    title: 'Sizing Guide',
    content: `Sizing Information:
- Jerseys: Available in S, M, L, XL, XXL
- Footwear: Available in UK sizes 6-12 (US sizes 7-13)
- Apparel: Available in S, M, L, XL
- Accessories: Various sizes available (check product page)
- Size charts available on each product page
- If unsure about sizing, contact support for assistance`,
    keywords: ['size', 'sizing', 'fit', 'size chart', 'measurements', 'UK size', 'US size'],
  },
  {
    id: 'faq-payment',
    type: 'faq',
    title: 'Payment Methods',
    content: `Payment Options:
- We accept all major credit cards (Visa, Mastercard, American Express)
- Secure payment processing via Stripe
- Payment is processed at checkout
- You will receive a payment confirmation email`,
    keywords: ['payment', 'credit card', 'stripe', 'how to pay', 'payment method'],
  },
  {
    id: 'faq-order-status',
    type: 'faq',
    title: 'Order Status',
    content: `Order Tracking:
- You will receive an order confirmation email immediately after placing your order
- Once your order ships, you'll receive a shipping confirmation with tracking number
- Track your order using the tracking number in your shipping email
- Orders typically process within 1-2 business days
- For order status inquiries, contact support@footies-shop.com with your order number`,
    keywords: ['order status', 'tracking', 'order tracking', 'where is my order', 'order confirmation'],
  },
  {
    id: 'faq-product-care',
    type: 'faq',
    title: 'Product Care',
    content: `Care Instructions:
- Jerseys: Machine wash cold, gentle cycle. Do not bleach. Hang dry or tumble dry low.
- Footwear: Clean with damp cloth. Air dry away from direct heat.
- Apparel: Follow care label instructions. Most items are machine washable.
- For specific care instructions, check the product page or contact support`,
    keywords: ['care', 'washing', 'cleaning', 'maintenance', 'how to clean', 'care instructions'],
  },
  {
    id: 'info-categories',
    type: 'category',
    title: 'Product Categories',
    content: `Our Product Categories:
- Jerseys: Official and replica football jerseys from top clubs and national teams (Nike, Adidas, Puma)
- Footballs: Match balls, training balls, and recreational footballs (Adidas, Nike, Puma, Select)
- Footwear: Football boots, indoor shoes, and training footwear (Nike, Adidas, Puma, New Balance)
- Apparel: Training gear, jackets, shorts, and more (Nike, Adidas, Under Armour)
- Accessories: Gloves, shin guards, bags, and other essentials (Nike, Adidas, Reusch)`,
    keywords: ['categories', 'jerseys', 'footballs', 'footwear', 'apparel', 'accessories', 'products'],
  },
];

/**
 * Search products in database by keywords
 */
async function searchProducts(query: string, limit: number = 5): Promise<KnowledgeBaseEntry[]> {
  try {
    const searchTerms = query.toLowerCase().split(/\s+/);

    // Search in product name, description, brand, and category
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, description, category, brand, price, category_slug')
      .or(
        searchTerms
          .map(term => `name.ilike.%${term}%,description.ilike.%${term}%,brand.ilike.%${term}%,category.ilike.%${term}%`)
          .join(',')
      )
      .limit(limit);

    if (error || !products) {
      console.error('Error searching products:', error);
      return [];
    }

    return products.map(product => ({
      id: product.id,
      type: 'product' as const,
      title: product.name,
      content: `${product.name} - ${product.description || ''} | Brand: ${product.brand} | Category: ${product.category} | Price: $${product.price}`,
      keywords: [
        product.name.toLowerCase(),
        product.brand.toLowerCase(),
        product.category.toLowerCase(),
        product.category_slug.toLowerCase(),
      ],
      metadata: {
        productId: product.id,
        brand: product.brand,
        category: product.category,
        price: product.price,
      },
    }));
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
}

/**
 * Retrieve relevant knowledge base entries based on query
 */
export async function retrieveContext(
  query: string,
  options: {
    includeProducts?: boolean;
    maxEntries?: number;
  } = {}
): Promise<KnowledgeBaseEntry[]> {
  const { includeProducts = true, maxEntries = 10 } = options;

  const queryLower = query.toLowerCase();
  const results: KnowledgeBaseEntry[] = [];

  // Search static knowledge base
  for (const entry of STATIC_KNOWLEDGE_BASE) {
    const relevanceScore = calculateRelevance(entry, queryLower);
    if (relevanceScore > 0) {
      results.push(entry);
    }
  }

  // Search products if requested
  if (includeProducts) {
    const productEntries = await searchProducts(query, 5);
    results.push(...productEntries);
  }

  // Sort by relevance (simple keyword matching)
  results.sort((a, b) => {
    const scoreA = calculateRelevance(a, queryLower);
    const scoreB = calculateRelevance(b, queryLower);
    return scoreB - scoreA;
  });

  // Return top N entries
  return results.slice(0, maxEntries);
}

/**
 * Calculate relevance score for an entry based on query
 */
function calculateRelevance(entry: KnowledgeBaseEntry, query: string): number {
  let score = 0;
  const queryWords = query.split(/\s+/);

  // Check title match
  const titleLower = entry.title.toLowerCase();
  for (const word of queryWords) {
    if (titleLower.includes(word)) {
      score += 3;
    }
  }

  // Check keyword match
  for (const keyword of entry.keywords) {
    for (const word of queryWords) {
      if (keyword.includes(word) || word.includes(keyword)) {
        score += 2;
      }
    }
  }

  // Check content match
  const contentLower = entry.content.toLowerCase();
  for (const word of queryWords) {
    if (contentLower.includes(word)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Format retrieved context for AI prompt
 */
export function formatContextForPrompt(entries: KnowledgeBaseEntry[]): string {
  if (entries.length === 0) {
    return '';
  }

  const sections: string[] = ['Relevant Information from Knowledge Base:'];

  for (const entry of entries) {
    sections.push(`\n[${entry.type.toUpperCase()}] ${entry.title}:`);
    sections.push(entry.content);
  }

  return sections.join('\n');
}

/**
 * Get product-specific context for suggestions
 */
export async function getProductContext(productId: string): Promise<string> {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('name, description, category, brand, price, category_slug')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return '';
    }

    // Get similar products in same category
    const { data: similarProducts } = await supabaseAdmin
      .from('products')
      .select('name, brand, price')
      .eq('category_slug', product.category_slug)
      .neq('id', productId)
      .limit(5);

    let context = `Current Product: ${product.name} (${product.brand}) - $${product.price}\n`;
    context += `Category: ${product.category}\n`;
    context += `Description: ${product.description || 'N/A'}\n`;

    if (similarProducts && similarProducts.length > 0) {
      context += `\nSimilar Products in ${product.category}:\n`;
      for (const similar of similarProducts) {
        context += `- ${similar.name} (${similar.brand}) - $${similar.price}\n`;
      }
    }

    return context;
  } catch (error) {
    console.error('Error getting product context:', error);
    return '';
  }
}

