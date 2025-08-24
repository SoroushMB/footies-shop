import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Product } from '@/models/Product';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const sortBy = searchParams.get('sortBy');

    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = firestore.collection('products');

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }
    if (brand) {
      query = query.where('brand', '==', brand);
    }

    // Apply sorting
    // Note: Firestore requires a composite index for queries that filter on one field
    // and sort on another. You will need to create this index in the Firebase console.
    if (sortBy) {
      if (sortBy === 'price_asc') {
        query = query.orderBy('price', 'asc');
      } else if (sortBy === 'price_desc') {
        query = query.orderBy('price', 'desc');
      }
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const products: Product[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching products.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
