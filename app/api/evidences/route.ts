import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request)
{
    try {
      const data = await request.json();
      
      // Add evidence
      const addEvidence = await prisma.evidences.create({
        data: {
          code: data.code,
          type: data.type,
          description: data.description,
          dateCollected: data.dateCollected,
          caseId: data.caseId,
        },
      });
      
      return NextResponse.json(addEvidence, { status: 201 });
    } catch (error) {
      console.error('Error adding evidence:', error);
      return NextResponse.json({ error: 'Failed to add evidence' }, { status: 500 });
    }
  }