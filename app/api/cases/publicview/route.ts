import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionDate = searchParams.get('institutionDate');
    const talukaId = searchParams.get('talukaId');
    const dehId = searchParams.get('dehId');
    const title = searchParams.get('title');

    // Build the where clause based on filters
    const where: any = {};
    
    if (institutionDate) {
      const date = new Date(institutionDate);
      where.dateOfInstitution = {
        gte: date,
        lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Add 24 hours to include the entire day
      };
    }

    if (talukaId) {
      where.talukaId = talukaId;
    }

    if (dehId) {
      where.dehId = dehId;
    }

    if (title) {
      where.title = {
        contains: title
      };
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        taluka: true,
        deh: true
      },
      orderBy: {
        dateOfInstitution: 'desc'
      }
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching public cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}