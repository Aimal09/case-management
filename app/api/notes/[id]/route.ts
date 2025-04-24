import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
      request: Request,
      { params }: { params: { id: string } }
    )
  {
  try {
    const noteId = params.id;
    console.log(noteId);
    
    const deletedNote = await prisma.notes.delete({
      where: {
        id: noteId,
      }
    });
    
    return NextResponse.json(deletedNote, { status : 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}