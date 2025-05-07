import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evidenceId = id;
    const data = await request.json();
    
    const updatedEvidence = await prisma.evidences.update({
      where: {
        id: evidenceId,
      },
      data: {
        type: data.type,
        description: data.description,
      },
    });
    
    return NextResponse.json(updatedEvidence);
  } catch (error) {
    console.error('Error updating evidence:', error);
    return NextResponse.json(
      { error: 'Failed to update evidence' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
)
  {
    try {
    const { id } = await params;
    const evidenceId = id;

    const deletedEvidence = await prisma.evidences.delete({
      where: {
        id: evidenceId,
      }
    });

    return NextResponse.json(deletedEvidence, { status : 200 });
  } 
  catch (error) {
    console.error('Error deleting evidence:', error);
    return NextResponse.json(
      { error: 'Failed to delete evidence' },
      { status: 500 }
    );
  }
}