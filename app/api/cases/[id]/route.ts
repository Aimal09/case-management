import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    
    const caseData = await prisma.case.findUnique({
      where: {
        id: caseId,
      },
      include: {
        //involvedOfficers: true,
        //involvedPersons: true,
        userCases: {
          include: {
            assignedToUser: true
          }
        },
        evidences: true,
        notes: true,
        forwardedToMukhtiarkar: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    
    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(caseData);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    const data = await request.json();
    
    // Extract the main case data
    const { 
      title, 
      caseType, 
      status, 
      taluka, 
      deh,
      dateOfInstitution, 
      nextDate, 
      location, 
      description,
      //involvedOfficers,
      //involvedPersons,
      evidences,
      notes
    } = data;
    
    // Update the case
    const updatedCase = await prisma.case.update({
      where: {
        id: caseId,
      },
      data: {
        title,
        caseType,
        status,
        taluka,
        deh,
        dateOfInstitution: new Date(dateOfInstitution),
        nextDate: new Date(nextDate),
        location,
        description
        // Handle relationships in a transaction if needed
      },
      include: {
        //involvedOfficers: true,
        //involvedPersons: true,
        evidences: true,
        notes: true,
      },
    });
    
    // For a more complex update with relationships, you might want to use a transaction
    // This is a simplified version - you may need to handle relationship updates separately
    
    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
)
  {
    try {
    const caseId = params.id;

    const deletedCase = await prisma.case.delete({
      where: {
        id: caseId,
      }
    });

    return NextResponse.json(deletedCase, { status : 200 });
  } 
  catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}