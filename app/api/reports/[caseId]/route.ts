import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } }  // Changed from 'id' to 'caseId'
) {
  try {
    const caseId = params.caseId;  // Changed from params.id to params.caseId

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },  // Updated error message
        { status: 400 }
      );
    }

    const reports = await prisma.report.findMany({  // Changed variable name from 'user' to 'reports'
      where: { caseId: caseId },
      select: {
        id: true,
        caseId: true,
        reportType: true,
        forwardedByMukhiarkar: true,
        forwardedByAC: true,
      },
    });

    // No need to check if reports is null since findMany returns an empty array if no records found
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);  // Updated error message
    return NextResponse.json(
      { error: 'Failed to fetch reports' },  // Updated error message
      { status: 500 }
    );
  }
}