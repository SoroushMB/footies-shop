import { NextResponse, NextRequest } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Cart } from '@/models/Cart';
import { z } from 'zod';

type Context = {
  params: {
    productId: string;
  };
};

const UpdateCartSchema = z.object({
  quantity: z.number().int().min(1), // Quantity must be at least 1
});

// PUT /api/cart/:productId - Update item quantity
export async function PUT(request: NextRequest, context: Context) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const { productId } = context.params;
    const body = await request.json();
    const validation = UpdateCartSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid data.', errors: validation.error.issues }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const { quantity } = validation.data;

    const cartDocRef = firestore.collection('carts').doc(uid);
    const cartDoc = await cartDocRef.get();

    if (!cartDoc.exists) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Cart not found.' }), { status: 404 });
    }

    let cart = cartDoc.data() as Cart;
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Product not in cart.' }), { status: 404 });
    }

    cart.items[itemIndex].quantity = quantity;
    await cartDocRef.set(cart);

    return NextResponse.json({ cart });

  } catch (error) {
    console.error('Error updating cart item:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while updating the cart.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// DELETE /api/cart/:productId - Remove item from cart
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const { productId } = context.params;

    const cartDocRef = firestore.collection('carts').doc(uid);
    const cartDoc = await cartDocRef.get();

    if (!cartDoc.exists) {
      // If cart doesn't exist, there's nothing to delete.
      return new NextResponse(JSON.stringify({ success: false, message: 'Cart not found.' }), { status: 404 });
    }

    let cart = cartDoc.data() as Cart;
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);

    if (cart.items.length === initialItemCount) {
        // Product was not in the cart, but the end state is correct.
        // We can return success or a specific message. Let's return success.
        return NextResponse.json({ cart });
    }

    await cartDocRef.set(cart);
    return NextResponse.json({ cart });

  } catch (error) {
    console.error('Error deleting cart item:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while deleting from the cart.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
