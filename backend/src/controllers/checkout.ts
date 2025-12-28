import { Request, Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import { CheckoutSchema } from '../models/schemas.js';
import { createPaymentIntent } from '../services/stripe.js';

/**
 * POST /api/checkout - Process checkout
 */
export async function processCheckout(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const input = CheckoutSchema.parse(req.body);

    // Get user's cart
    const { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cartError || !cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
      return;
    }

    // Get cart items with product details
    const { data: cartItems, error: itemsError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        quantity,
        price,
        size,
        product_id,
        product:products(id, name, price, stock)
      `)
      .eq('cart_id', cart.id);

    if (itemsError) {
      console.error('Get cart items error:', itemsError);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cart items',
      });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
      return;
    }

    // Validate stock for all items
    for (const item of cartItems) {
      const product = item.product as { stock: number; name: string } | null;
      if (product && product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
        return;
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create Stripe payment intent
    let paymentIntentId: string | null = null;
    if (input.paymentIntentId) {
      paymentIntentId = input.paymentIntentId;
    } else {
      try {
        const paymentIntent = await createPaymentIntent(totalAmount, 'usd', {
          userId,
          orderType: 'checkout',
        });
        paymentIntentId = paymentIntent.id;
      } catch (error) {
        console.error('Payment intent creation error:', error);
        // Continue without payment intent if Stripe is not configured
        if (error instanceof Error && error.message.includes('not configured')) {
          console.warn('Stripe not configured, proceeding without payment intent');
        } else {
          res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
          });
          return;
        }
      }
    }

    // Create order
    const orderItems = cartItems.map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
    }));

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        items: orderItems,
        total_amount: totalAmount,
        shipping_address: input.shippingAddress,
        payment_intent_id: paymentIntentId,
        status: paymentIntentId ? 'pending' : 'processing',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Create order error:', orderError);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
      });
      return;
    }

    // Update product stock
    for (const item of cartItems) {
      const product = item.product as { id: string; stock: number } | null;
      if (product) {
        await supabaseAdmin
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', product.id);
      }
    }

    // Clear cart
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    // Save shipping address to user profile
    await supabaseAdmin
      .from('users')
      .upsert({
        clerk_id: userId,
        shipping_address: input.shippingAddress,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'clerk_id',
      });

    // Get client secret if payment intent was created
    let clientSecret: string | null = null;
    if (paymentIntentId) {
      try {
        const { getPaymentIntent } = await import('../services/stripe.js');
        const paymentIntent = await getPaymentIntent(paymentIntentId);
        clientSecret = paymentIntent?.client_secret || null;
      } catch (error) {
        console.error('Failed to retrieve payment intent:', error);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.id,
        totalAmount,
        status: paymentIntentId ? 'pending' : 'processing',
        paymentIntentId,
        clientSecret,
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

    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/orders - Get user's orders
 */
export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
      });
      return;
    }

    const transformedOrders = orders?.map(o => ({
      id: o.id,
      items: o.items,
      totalAmount: o.total_amount,
      shippingAddress: o.shipping_address,
      status: o.status,
      createdAt: o.created_at,
    }));

    res.json({
      success: true,
      data: transformedOrders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/orders/:id - Get order by ID
 */
export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: order.id,
        items: order.items,
        totalAmount: order.total_amount,
        shippingAddress: order.shipping_address,
        status: order.status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

