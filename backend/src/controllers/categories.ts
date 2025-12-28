import { Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';

/**
 * GET /api/categories - Get all categories
 */
export async function getCategories(_req: Request, res: Response): Promise<void> {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
      });
      return;
    }

    const transformedCategories = categories?.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image_url,
      filters: c.filters,
    }));

    res.json({
      success: true,
      data: transformedCategories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/categories/:slug - Get category by slug
 */
export async function getCategoryBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    // Also fetch products in this category
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category_slug', slug)
      .order('created_at', { ascending: false });

    const transformedProducts = products?.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      categorySlug: p.category_slug,
      price: p.price,
      images: p.images,
      brand: p.brand,
      sizes: p.sizes,
      isFeatured: p.is_featured,
      isPopular: p.is_popular,
    }));

    res.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.image_url,
          filters: category.filters,
        },
        products: transformedProducts || [],
      },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

