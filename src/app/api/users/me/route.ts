import { NextResponse, NextRequest } from 'next/server';
import { firestore, auth as adminAuth } from '@/lib/firebase-admin';
import { User } from '@/models/User';
import { z } from 'zod';

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }).optional(),
});

// GET /api/users/me - Get the current user's profile
export async function GET(request: NextRequest) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      // This should not happen if middleware is set up correctly
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const userDocRef = firestore.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // If user profile doesn't exist in Firestore, create it from Auth
      const firebaseUser = await adminAuth.getUser(uid);
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'New User',
      };
      await userDocRef.set(newUser);
      return NextResponse.json({ user: newUser });
    }

    const user = { id: userDoc.id, ...userDoc.data() } as User;
    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error getting user profile:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching user profile.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// PUT /api/users/me - Update the current user's profile
export async function PUT(request: NextRequest) {
  try {
    const uid = request.headers.get('X-User-ID');
    if (!uid) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const validation = UpdateUserSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid data.', errors: validation.error.issues }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const userDocRef = firestore.collection('users').doc(uid);
    await userDocRef.set(validation.data, { merge: true });

    const updatedDoc = await userDocRef.get();
    const updatedUser = { id: updatedDoc.id, ...updatedDoc.data() } as User;

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while updating user profile.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
