import { Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { ProductQuerySchema } from '../models/schemas.js';

/**
 * GET /api/products - Get all products with filtering and pagination
 */
export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const query = ProductQuerySchema.parse(req.query);

    let dbQuery = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query.category) {
      dbQuery = dbQuery.eq('category_slug', query.category);
    }

    if (query.brand) {
      dbQuery = dbQuery.eq('brand', query.brand);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query.search}%,description.ilike.%${query.search}%`
      );
    }

    if (query.minPrice !== undefined) {
      dbQuery = dbQuery.gte('price', query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      dbQuery = dbQuery.lte('price', query.maxPrice);
    }

    // Apply sorting
    switch (query.sortBy) {
      case 'price_asc':
        dbQuery = dbQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        dbQuery = dbQuery.order('price', { ascending: false });
        break;
      case 'name_asc':
        dbQuery = dbQuery.order('name', { ascending: true });
        break;
      case 'name_desc':
        dbQuery = dbQuery.order('name', { ascending: false });
        break;
      case 'newest':
        dbQuery = dbQuery.order('created_at', { ascending: false });
        break;
      default:
        dbQuery = dbQuery.order('created_at', { ascending: false });
    }

    // Apply pagination
    const offset = (query.page - 1) * query.limit;
    dbQuery = dbQuery.range(offset, offset + query.limit - 1);

    const { data: products, error, count } = await dbQuery;

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
      });
      return;
    }

    // Transform snake_case to camelCase
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
      stock: p.stock,
    }));

    res.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / query.limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error,
      });
      return;
    }

    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/products/:id - Get a single product by ID
 */
export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error || !product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        category: product.category,
        categorySlug: product.category_slug,
        price: product.price,
        images: product.images,
        brand: product.brand,
        sizes: product.sizes,
        isFeatured: product.is_featured,
        isPopular: product.is_popular,
        stock: product.stock,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/products/featured - Get featured products
 */
export async function getFeaturedProducts(_req: Request, res: Response): Promise<void> {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured products',
      });
      return;
    }

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
      data: transformedProducts,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/products/popular - Get popular products
 */
export async function getPopularProducts(_req: Request, res: Response): Promise<void> {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_popular', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch popular products',
      });
      return;
    }

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
      data: transformedProducts,
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

