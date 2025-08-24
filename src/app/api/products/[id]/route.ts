import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Product } from '@/models/Product';

type Context = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, context: Context) {
  try {
    const { id } = context.params;
    const docRef = firestore.collection('products').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Product not found.' }),
        { status: 404, headers: { 'content-type': 'application/json' } }
      );
    }

    const product: Product = { id: doc.id, ...doc.data() } as Product;

    return NextResponse.json({ product });
  } catch (error) {
    console.error(`Error fetching product with ID:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching the product.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
