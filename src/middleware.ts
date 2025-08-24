import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  // All routes matched by the matcher are protected
  const authorization = request.headers.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authorization header missing or invalid.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  const idToken = authorization.split('Bearer ')[1];

  if (!idToken) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'ID token missing.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid } = decodedToken;

    // Add the user's UID to the request headers so API routes can access it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', uid);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed: Invalid token.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/api/users/me',
    '/api/cart/:path*',
    '/api/checkout/:path*',
    '/api/ai/suggestions/:path*',
  ],
};
