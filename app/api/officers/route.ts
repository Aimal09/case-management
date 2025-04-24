import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request)
{
    try {
      const data = await request.json();
      
      // Add officer
      const createOfficer = await prisma.involvedOfficers.create({
        data: {
          code: data.code,
          name: data.name,
          badge: data.badge,
          caseId: data.caseId,
        },
      });
      
      return NextResponse.json(createOfficer, { status: 201 });
    } catch (error) {
      console.error('Error creating officer:', error);
      return NextResponse.json({ error: 'Failed to create officer' }, { status: 500 });
    }
  }