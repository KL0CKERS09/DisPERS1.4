import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';

export async function GET() {
  try {
    const client = await connectToDB();
    const db = client; // Since Mongoose connection is the db itself
    const count = await db.collection('alerts').countDocuments();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching report count:', error);
    return NextResponse.json({ error: 'Error fetching report count' }, { status: 500 });
  }
}
