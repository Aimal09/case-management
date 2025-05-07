import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { useAuth } from '@/app/context/AuthContext';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string; reportType: string }> }
) {
  try {
    const user = useAuth();
    // Check authentication
    if (!user.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { caseId, reportType } = await params;

    // Fetch the case
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Get the report path based on the report type
    let reportPath;
    let reportUploaded = false;

    switch (reportType) {
      case 'mukhtiarkarACReport':
        reportPath = caseData.mukhtiarkarACReportPath;
        reportUploaded = caseData.mukhtiarkarACReportUploaded || false;
        break;
      case 'evacueePropertyReport':
        reportPath = caseData.evacueePropertyReportPath;
        reportUploaded = caseData.evacueePropertyReportUploaded || false;
        break;
      case 'barrageBranchReport':
        reportPath = caseData.barrageBranchReportPath;
        reportUploaded = caseData.barrageBranchReportUploaded || false;
        break;
      case 'newspaperPublication':
        reportPath = caseData.newspaperPublicationPath;
        reportUploaded = caseData.newspaperPublicationUploaded || false;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    if (!reportUploaded || !reportPath) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Return the report path
    return NextResponse.json({
      success: true,
      reportPath,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}