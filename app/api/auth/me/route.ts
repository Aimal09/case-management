import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define the interface for the decoded JWT payload
interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export async function GET(request: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header:', authHeader);
    
    // Also check for token in cookies as a fallback
    const cookies = request.headers.get('cookie');
    console.log('Cookies:', cookies);
    
    let cookieToken = null;
    
    if (cookies) {
      const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('authToken='));
      if (tokenCookie) {
        cookieToken = tokenCookie.split('=')[1];
      }
    }
    
    // Use either Authorization header or cookie token
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }
    
    console.log('Token found:', !!token);
    
    if (!token) {
      return NextResponse.json(
        { message: 'No authentication token provided' },
        { status: 401 }
      );
    }
    
    // Check if token is properly formatted
    try {
      // Verify the token with proper typing
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      console.log('Token verified successfully:', decoded);
      
      // Return the user info
      return NextResponse.json({ 
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        }
      });
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { message: `Token verification failed: ${verifyError}` },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token processing error:', error);
    return NextResponse.json(
      { message: `Error processing request: ${error}` },
      { status: 500 }
    );
  }
}