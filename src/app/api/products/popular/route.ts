import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    const query = firestore.collection('products').where('isPopular', '==', true);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const products: Product[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching popular products.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
