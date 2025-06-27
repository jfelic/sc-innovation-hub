import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/companies/[id]/favorite - Check if company is favorited by current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false }, { status: 200 });
    }

    // Check if the company bookmark exists for this user
    const bookmark = await prisma.companyBookmark.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: id,
        },
      },
    });

    return NextResponse.json({ isFavorited: !!bookmark }, { status: 200 });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies/[id]/favorite - Add company to favorites
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if the company exists
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Create the bookmark (upsert to avoid duplicates)
    const bookmark = await prisma.companyBookmark.upsert({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: id,
        },
      },
      update: {}, // No update needed if already exists
      create: {
        userId: session.user.id,
        companyId: id,
      },
    });

    return NextResponse.json({ success: true, bookmark }, { status: 201 });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id]/favorite - Remove company from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete the bookmark if it exists
    const deletedBookmark = await prisma.companyBookmark.deleteMany({
      where: {
        userId: session.user.id,
        companyId: id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      deleted: deletedBookmark.count > 0 
    }, { status: 200 });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}