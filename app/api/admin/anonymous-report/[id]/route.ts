import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDB } from '@/libs/mongodb';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const { status } = await req.json();

    if (!['Active', 'Resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const { db } = await connectToDB();

    const result = await db.collection('anonymousReport').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
