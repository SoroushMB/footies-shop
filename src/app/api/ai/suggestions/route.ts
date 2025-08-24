import { NextResponse, NextRequest } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { productSuggestion } from '@/ai/flows/product-suggestion';
import { z } from 'zod';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

const SuggestionRequestSchema = z.object({
  currentProductId: z.string().min(1),
});

// POST /api/ai/suggestions - Get AI-powered product suggestions
export async function POST(request: NextRequest) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validation = SuggestionRequestSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid request body.', errors: validation.error.issues }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const { currentProductId } = validation.data;

    // Fetch the current product's details
    const productRef = firestore.collection('products').doc(currentProductId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Product not found.' }), { status: 404 });
    }
    const product = productDoc.data() as Product;

    // Fetch the user's profile
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();
    let userProfileString = 'No profile available.';
    if (userDoc.exists) {
      const user = userDoc.data() as User;
      // Convert user profile to a string for the AI prompt
      userProfileString = `Name: ${user.name}, Email: ${user.email}`;
    }

    // Call the Genkit flow
    const suggestions = await productSuggestion({
      currentSelection: product.name,
      userProfile: userProfileString,
    });

    return NextResponse.json(suggestions);

  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while getting suggestions.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
