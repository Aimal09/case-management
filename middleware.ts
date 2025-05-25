import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { compactDecrypt, jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/signup'];

// Function to verify JWT token
const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
  
  // Check if the path is an API route
  const isApiRoute = path.startsWith('/api');
  
  // TEMPORARY: Allow all API routes during development
  if (isApiRoute && process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Rest of the middleware remains the same
  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value;
  console.log(`token: ${token}`);
  
  // If there's no token and it's not a public route, redirect to login
  if (!token && !isApiRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  // For API routes, check the Authorization header if no cookie token
  let apiToken = token;
  if (!apiToken && isApiRoute) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiToken = authHeader.substring(7);
    }
  }
  
  // If it's an API route and there's no token, return 401
  if (!apiToken && isApiRoute) {
    return NextResponse.json({ message: `apitoken: "${apiToken}"; isApiRoute:"${isApiRoute}"; Unauthorized | No Token` }, { status: 401 });
  }
  
  // Verify the token
  if (apiToken) {
    const payload = await verifyToken(apiToken);
    
    // If the token is invalid, redirect to login or return 401 for API routes
    if (!payload) {
      if (isApiRoute) {
        return NextResponse.json({ message: 'Unauthorized | Invalid Token' }, { status: 401 });
      } else {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', path);
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};