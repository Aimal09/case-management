import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../../generated/prisma';

export const runtime = 'nodejs';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

async function writeLog(level: string, route: string, message: string) {
  await prisma.log.create({
    data: { level, route, message }
  });
}

export async function POST(request: Request) {
  await writeLog('INFO', 'auth/login/Route.ts', 'Handler hit');
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
  try {
    // Log the entire request for debugging
    await writeLog('INFO', 'auth/login/Route.ts', 'Login request received');
    
    let requestBody;
    try {
      requestBody = await request.json();
      await writeLog('INFO', 'auth/login/Route.ts', 'Request body parsed successfully');
    } catch (parseError) {
      await writeLog('ERROR', 'auth/login/Route.ts', `Error parsing request body ${parseError}`);
      return NextResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { email, password } = requestBody;
    console.log('Login attempt for:', email);
    await writeLog('INFO', 'auth/login/Route.ts', `Login attempt for ${email}`);
    // Find user by email from database
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      await writeLog('ERROR', 'auth/login/Route.ts', `User not found ${email}`);
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
    
    await writeLog('INFO', 'auth/login/Route.ts', `Password valid ${isPasswordValid}`);
    
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
    console.log('Generated token:', token);
    await writeLog('INFO', 'auth/login/Route.ts', `Generated token ${token}`);
    
    await writeLog('INFO', 'auth/login/Route.ts', `Login successful for ${email}`);

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
    
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60, // 8 hours
      sameSite: 'lax',
      path: '/',
    });

    await writeLog('INFO', 'auth/login/Route.ts', `Response ${response}`);
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