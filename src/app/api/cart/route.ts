import { NextResponse, NextRequest } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Cart, CartItem } from '@/models/Cart';
import { z } from 'zod';
import { Product } from '@/models/Product';

const AddToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

// GET /api/cart - Get the user's cart
export async function GET(request: NextRequest) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const cartDocRef = firestore.collection('carts').doc(uid);
    const cartDoc = await cartDocRef.get();

    if (!cartDoc.exists) {
      // If cart doesn't exist, return a default empty cart structure
      const emptyCart: Cart = { userId: uid, items: [] };
      return NextResponse.json({ cart: emptyCart });
    }

    return NextResponse.json({ cart: cartDoc.data() as Cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching the cart.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// POST /api/cart - Add a product to the cart
export async function POST(request: NextRequest) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validation = AddToCartSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid data.', errors: validation.error.issues }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const { productId, quantity } = validation.data;

    // Fetch product to get current price
    const productRef = firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Product not found.' }), { status: 404 });
    }
    const product = productDoc.data() as Product;

    const cartDocRef = firestore.collection('carts').doc(uid);
    const cartDoc = await cartDocRef.get();

    let cart: Cart;
    if (!cartDoc.exists) {
      cart = { userId: uid, items: [] };
    } else {
      cart = cartDoc.data() as Cart;
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Product already in cart, update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Product not in cart, add new item
      const newCartItem: CartItem = {
        productId: productId,
        quantity: quantity,
        price: product.price, // Use price from DB
      };
      cart.items.push(newCartItem);
    }

    await cartDocRef.set(cart);

    return NextResponse.json({ cart });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while adding to the cart.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
