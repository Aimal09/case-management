import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request)
{
    try {
      const data = await request.json();
      
      // Add Note
      const createNote = await prisma.notes.create({
        data: {
          code: data.code,
          title: data.title,
          content: data.content,
          caseId: data.caseId,
        },
      });
      
      return NextResponse.json(createNote, { status: 201 });
    } catch (error) {
      console.error('Error creating note:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
  }