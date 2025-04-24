import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
      request: Request,
      { params }: { params: { id: string } }
    )
  {
  try {
    const officerId = params.id;
    console.log(officerId);
    
    const deletedOfficer = await prisma.involvedOfficers.delete({
      where: {
        id: officerId,
      }
    });
    
    return NextResponse.json(deletedOfficer, { status : 200 });
  } catch (error) {
    console.error('Error deleting officer:', error);
    return NextResponse.json(
      { error: 'Failed to delete officer' },
      { status: 500 }
    );
  }
}