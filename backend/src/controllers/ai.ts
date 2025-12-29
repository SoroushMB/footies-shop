import { Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { getProductSuggestions, supportChat } from '../services/ai.js';
import { ProductSuggestionRequestSchema, ChatRequestSchema } from '../models/schemas.js';

/**
 * POST /api/ai/suggestions - Get AI product suggestions
 */
export async function getSuggestions(req: Request, res: Response): Promise<void> {
  try {
    const input = ProductSuggestionRequestSchema.parse(req.body);

    // Get the current product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', input.currentProductId)
      .single();

    if (productError || !product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Get user's recent purchases if authenticated
    let userProfile: { recentPurchases?: string[]; preferences?: string[] } | undefined;

    if (req.userId) {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('items')
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders && orders.length > 0) {
        const recentProductIds = orders
          .flatMap(o => (o.items as Array<{ productId: string }>).map(item => item.productId))
          .slice(0, 10);

        const { data: recentProducts } = await supabaseAdmin
          .from('products')
          .select('name')
          .in('id', recentProductIds);

        userProfile = {
          recentPurchases: recentProducts?.map(p => p.name) || [],
        };
      }
    }

    const result = await getProductSuggestions(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: product.price,
      },
      userProfile
    );

    // Try to find matching products for suggestions
    const suggestedProducts: Array<{ id: string; name: string; slug: string; price: number; images: string[] }> = [];

    for (const suggestionName of result.suggestions) {
      const { data: matchingProducts } = await supabaseAdmin
        .from('products')
        .select('id, name, slug, price, images')
        .ilike('name', `%${suggestionName}%`)
        .neq('id', input.currentProductId)
        .limit(1);

      if (matchingProducts && matchingProducts.length > 0) {
        suggestedProducts.push(matchingProducts[0]);
      }
    }

    // If not enough matches, get random products from same category
    if (suggestedProducts.length < 3) {
      const { data: categoryProducts } = await supabaseAdmin
        .from('products')
        .select('id, name, slug, price, images')
        .eq('category_slug', product.category_slug)
        .neq('id', input.currentProductId)
        .limit(3 - suggestedProducts.length);

      if (categoryProducts) {
        for (const p of categoryProducts) {
          if (!suggestedProducts.find(sp => sp.id === p.id)) {
            suggestedProducts.push(p);
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        suggestions: suggestedProducts,
        reasoning: result.reasoning,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: error,
      });
      return;
    }

    console.error('AI suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * POST /api/ai/chat - Customer support chat
 */
export async function chat(req: Request, res: Response): Promise<void> {
  try {
    const input = ChatRequestSchema.parse(req.body);

    const result = await supportChat(
      input.message,
      input.conversationHistory
    );

    res.json({
      success: true,
      data: {
        response: result.response,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: error,
      });
      return;
    }

    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

