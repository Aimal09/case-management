import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { caseId, userId, userName, assignedToUserId } = await request.json();

    // Validate required fields
    if (!caseId || !userId || !assignedToUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new userCase record
    const userCase = await prisma.userCases.create({
      data: {
        userId,
        caseId,
        assignedToUserId,
      },
    });

    // Update the case with the forwarded Mukhtiarkar ID and AC name
    await prisma.case.update({
      where: { id: caseId },
      data: {
        forwardedToMukhtiarkarId: assignedToUserId,
        forwardedByName: userName  // Store the name of the AC who forwarded
      }
    });

    return NextResponse.json({
      success: true,
      userCase,
    });
  } catch (error) {
    console.error('Error forwarding case:', error);
    return NextResponse.json(
      { error: 'Failed to forward case' },
      { status: 500 }
    );
  }
}