import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Helper to verify HMAC on the Edge using Web Crypto API
async function verifySignature(code: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  // Convert hex signature string back to Uint8Array for verification
  const hexMatches = signature.match(/.{1,2}/g);
  if (!hexMatches) return false;
  
  const signatureBytes = new Uint8Array(hexMatches.map(byte => parseInt(byte, 16)));

  return await crypto.subtle.verify(
    'HMAC',
    cryptoKey,
    signatureBytes,
    encoder.encode(code)
  );
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('fazalk-access-token')?.value;
  const isApi = request.nextUrl.pathname.startsWith('/api/');
  const isInvitePage = request.nextUrl.pathname === '/invite';

  let isAuthenticated = false;

  if (token) {
    const [code, signature] = token.split('.');
    if (code && signature) {
      const validCodes = (process.env.INVITE_CODES || '').split(',').map(c => c.trim().toLowerCase());
      if (validCodes.includes(code.toLowerCase())) {
        const secret = process.env.INVITE_SECRET;
        if (secret) {
          try {
            isAuthenticated = await verifySignature(code.toLowerCase(), signature, secret);
          } catch (e) {
            isAuthenticated = false;
          }
        }
        // If INVITE_SECRET is not configured, authentication fails — no insecure fallback
      }
    }
  }

  // If already authenticated and trying to visit /invite, redirect to root
  if (isAuthenticated && isInvitePage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If not authenticated and NOT going to /invite or unprotected routes
  if (!isAuthenticated && !isInvitePage && request.nextUrl.pathname !== '/api/verify-invite') {
    if (isApi) {
      // Return hard 401 for unauthorised API requests
      return NextResponse.json({ error: 'Access Denied: Invitation Required' }, { status: 401 });
    }
    // Perform standard redirect for regular pages
    return NextResponse.redirect(new URL('/invite', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for the ones starting with:
     * - _next/static (static assets like JS/CSS)
     * - _next/image (image optimization wrapper)
     * - favicon.ico (browser icon)
     * - public files (images, grid svg, etc needed for the invite page itself)
     */
    '/((?!_next/static|_next/image|favicon.ico|img/).*)',
  ],
}
