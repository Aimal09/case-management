import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { reportType, userRole, caseId } = await request.json();

    // Validate required fields
    if (!reportType || !caseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the report to verify it exists
    const report = await prisma.report.findFirst({
      where: { reportType: reportType, caseId: caseId }
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not uploaded' },
        { status: 404 }
      );
    }

    const updateData = userRole === 'AC' ? {forwardedByAC: true} : {forwardedByMukhiarkar: true};
    // Update the report to mark it as forwarded by Mukhtiarkar
    const updatedReport = await prisma.report.update({
      where: { id: report.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      report: updatedReport,
    });

  } catch (error) {
    console.error('Error forwarding report:', error);
    return NextResponse.json(
      { error: 'Failed to forward report' },
      { status: 500 }
    );
  }
}