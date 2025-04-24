import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request)
{
    try {
      const data = await request.json();
      
      // Add persons if any
      const createPerson = await prisma.involvedPersons.create({
        data: {
          code: data.code,
          name: data.name,
          role: data.role,
          contact: data.contact,
          addedOn: data.addedOn,
          caseId: data.caseId,
        },
      });
      
      return NextResponse.json(createPerson, { status: 201 });
    } catch (error) {
      console.error('Error creating person:', error);
      return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
    }
  }