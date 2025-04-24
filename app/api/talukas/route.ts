import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const talukas = await prisma.taluka.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(talukas);
  } catch (error) {
    console.error('Error fetching talukas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talukas' },
      { status: 500 }
    );
  }
}