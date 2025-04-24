import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const talukaId = searchParams.get('talukaId');

    if (!talukaId) {
      return NextResponse.json(
        { error: 'Taluka ID is required' },
        { status: 400 }
      );
    }

    const dehs = await prisma.deh.findMany({
      where: {
        talukaId: talukaId
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(dehs);
  } catch (error) {
    console.error('Error fetching dehs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dehs' },
      { status: 500 }
    );
  }
}