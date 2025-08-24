import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { Category } from '@/models/Category';

type Context = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, context: Context) {
  try {
    const { slug } = context.params;
    const query = firestore.collection('categories').where('slug', '==', slug);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Category not found.' }),
        { status: 404, headers: { 'content-type': 'application/json' } }
      );
    }

    // Since slug is unique, there should be only one document
    const doc = snapshot.docs[0];
    const category: Category = { id: doc.id, ...doc.data() } as Category;

    return NextResponse.json({ category });
  } catch (error) {
    console.error(`Error fetching category with slug ${context.params.slug}:`, error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching the category.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
