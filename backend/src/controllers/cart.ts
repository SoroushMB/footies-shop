import { Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { AddToCartSchema, UpdateCartItemSchema } from '../models/schemas.js';

/**
 * GET /api/cart - Get user's cart
 */
export async function getCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Get or create cart
    let { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      // Create cart if doesn't exist
      const { data: newCart, error: createError } = await supabaseAdmin
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();

      if (createError) {
        console.error('Create cart error:', createError);
        res.status(500).json({
          success: false,
          message: 'Failed to create cart',
        });
        return;
      }
      cart = newCart;
    }

    // Get cart items with product details
    const { data: cartItems, error: itemsError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        quantity,
        price,
        size,
        product:products(id, slug, name, images, price, brand, sizes)
      `)
      .eq('cart_id', cart.id);

    if (itemsError) {
      console.error('Get cart items error:', itemsError);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart',
      });
      return;
    }

    const transformedItems = cartItems?.map(item => ({
      id: item.id,
      productId: (item.product as { id: string })?.id,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      product: item.product,
    }));

    const totalAmount = transformedItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

    res.json({
      success: true,
      data: {
        items: transformedItems,
        totalAmount,
        itemCount: transformedItems?.length || 0,
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * POST /api/cart - Add item to cart
 */
export async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const input = AddToCartSchema.parse(req.body);

    // Verify product exists and get price
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, price, stock')
      .eq('id', input.productId)
      .single();

    if (productError || !product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Check stock
    if (product.stock < input.quantity) {
      res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
      return;
    }

    // Get or create cart
    let { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      const { data: newCart, error: createError } = await supabaseAdmin
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();

      if (createError) {
        console.error('Create cart error:', createError);
        res.status(500).json({
          success: false,
          message: 'Failed to create cart',
        });
        return;
      }
      cart = newCart;
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', input.productId)
      .eq('size', input.size || '')
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + input.quantity;

      if (product.stock < newQuantity) {
        res.status(400).json({
          success: false,
          message: 'Insufficient stock for requested quantity',
        });
        return;
      }

      const { error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Update cart item error:', updateError);
        res.status(500).json({
          success: false,
          message: 'Failed to update cart item',
        });
        return;
      }
    } else {
      // Add new item
      const { error: insertError } = await supabaseAdmin
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: input.productId,
          quantity: input.quantity,
          price: product.price,
          size: input.size || '',
        });

      if (insertError) {
        console.error('Insert cart item error:', insertError);
        res.status(500).json({
          success: false,
          message: 'Failed to add item to cart',
        });
        return;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
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

    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * PUT /api/cart/:itemId - Update cart item quantity
 */
export async function updateCartItem(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { itemId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const input = UpdateCartItemSchema.parse(req.body);

    // Get user's cart
    const { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
      return;
    }

    // Verify item belongs to user's cart
    const { data: cartItem } = await supabaseAdmin
      .from('cart_items')
      .select('id, product_id')
      .eq('id', itemId)
      .eq('cart_id', cart.id)
      .single();

    if (!cartItem) {
      res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
      return;
    }

    if (input.quantity === 0) {
      // Remove item
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      res.json({
        success: true,
        message: 'Item removed from cart',
      });
      return;
    }

    // Check stock
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('stock')
      .eq('id', cartItem.product_id)
      .single();

    if (product && product.stock < input.quantity) {
      res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
      return;
    }

    // Update quantity
    const { error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity: input.quantity })
      .eq('id', itemId);

    if (updateError) {
      console.error('Update cart item error:', updateError);
      res.status(500).json({
        success: false,
        message: 'Failed to update cart item',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Cart item updated',
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

    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * DELETE /api/cart/:itemId - Remove item from cart
 */
export async function removeFromCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { itemId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Get user's cart
    const { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
      return;
    }

    // Verify item belongs to user's cart and delete
    const { error: deleteError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('cart_id', cart.id);

    if (deleteError) {
      console.error('Delete cart item error:', deleteError);
      res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

