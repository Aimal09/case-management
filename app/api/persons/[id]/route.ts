import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = id;
    const data = await request.json();
    
    // const updatedPerson = await prisma.involvedPersons.update({
    //   where: {
    //     id: personId,
    //   },
    //   data: {
    //     name: data.name,
    //     role: data.role,
    //     contact: data.contact,
    //   },
    // });
    
    //return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json(
      { error: 'Failed to update person' },
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
    const personId = id;
    console.log(personId);
    
    // const deletedPerson = await prisma.involvedPersons.delete({
    //   where: {
    //     id: personId,
    //   }
    // });
    
    // return NextResponse.json(deletedPerson, { status : 200 });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json(
      { error: 'Failed to delete person' },
      { status: 500 }
    );
  }
}