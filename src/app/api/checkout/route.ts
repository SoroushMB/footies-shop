import { NextResponse, NextRequest } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Cart } from '@/models/Cart';
import { Order, OrderStatus } from '@/models/Order';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const CheckoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
});

// POST /api/checkout - Handle the checkout process
export async function POST(request: NextRequest) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validation = CheckoutSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid shipping address.', errors: validation.error.issues }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const { shippingAddress } = validation.data;

    // 1. Fetch the user's cart
    const cartDocRef = firestore.collection('carts').doc(uid);
    const cartDoc = await cartDocRef.get();

    if (!cartDoc.exists || !cartDoc.data()?.items?.length) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Your cart is empty.' }), { status: 400 });
    }
    const cart = cartDoc.data() as Cart;

    // 2. Simulate payment processing (as per README instructions)
    // In a real application, you would integrate with a payment provider here.
    const paymentSuccessful = true;
    if (!paymentSuccessful) {
        return new NextResponse(JSON.stringify({ success: false, message: 'Payment failed.' }), { status: 400 });
    }

    // 3. Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 4. Create a new order document
    const newOrder: Order = {
      orderId: randomUUID(),
      userId: uid,
      items: cart.items,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      orderDate: new Date(),
      status: 'pending' as OrderStatus,
    };

    const orderRef = firestore.collection('orders').doc(newOrder.orderId);
    await orderRef.set(newOrder);

    // 5. Clear the user's cart
    await cartDocRef.delete();

    // 6. Return the new order
    return NextResponse.json({ success: true, order: newOrder });

  } catch (error) {
    console.error('Error during checkout:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred during checkout.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
