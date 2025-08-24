import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Category } from '@/models/Category';

export async function GET() {
  try {
    const snapshot = await firestore.collection('categories').get();
    if (snapshot.empty) {
      return NextResponse.json({ categories: [] }, { status: 200 });
    }

    const categories: Category[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching categories.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
