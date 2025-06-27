import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/events/[id]/favorite - Check if event is favorited by current user
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

    // Check if the event bookmark exists for this user
    const bookmark = await prisma.eventBookmark.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id,
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

// POST /api/events/[id]/favorite - Add event to favorites
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

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Create the bookmark (upsert to avoid duplicates)
    const bookmark = await prisma.eventBookmark.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id,
        },
      },
      update: {}, // No update needed if already exists
      create: {
        userId: session.user.id,
        eventId: id,
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

// DELETE /api/events/[id]/favorite - Remove event from favorites
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
    const deletedBookmark = await prisma.eventBookmark.deleteMany({
      where: {
        userId: session.user.id,
        eventId: id,
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