import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    let whereClause = {};
    
    if (role) {
      // If role parameter is provided, filter by it
      if (role === 'AC,Mukhtiarkar') {
        whereClause = {
          OR: [
            { role: 'AC' },
            { role: 'Mukhtiarkar' }
          ]
        };
      } else {
        whereClause = { role };
      }
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        designation: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}