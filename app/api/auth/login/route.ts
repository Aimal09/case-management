import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../../generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

const logDebug = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}${data ? ` - ${JSON.stringify(data, null, 2)}` : ''}\n`;
  fs.appendFileSync(path.join(process.cwd(), 'public', 'login-debug.log'), logMessage);
};

export async function POST(request: Request) {
  try {
    // Log the entire request for debugging
    logDebug('Line20: Login request received');
    
    let requestBody;
    try {
      requestBody = await request.json();
      logDebug('Line25: Request body parsed successfully');
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { email, password } = requestBody;
    logDebug('Line35: Login attempt for:', email);
    // Find user by email from database
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      logDebug('Line44: User not found:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // For testing purposes, directly check if password is "password123"
    // In production, you would use bcrypt.compare
    let isPasswordValid = false;
    
    if (user.password) {
      // Try bcrypt compare if user has a password
      isPasswordValid = await bcrypt.compare(password, user.password);
    }
    
    logDebug('Line60: Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    logDebug('Line81: Login successful for:', email);
    
    // Set token in cookies as well for better auth handling
    const response = NextResponse.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        designation: user.designation
      }
    });
    
    logDebug(`Line95: Token set in cookies: ${token}`);
    logDebug(`Line96: Response: ${response}`);

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60, // 8 hours
      //sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}