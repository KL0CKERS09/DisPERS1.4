import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDB(); // Just connect, don't assign to a variable
    const count = await mongoose.connection.db
      .collection('anonymousReport')
      .countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching anonymous report count:', error);
    return NextResponse.json({ error: 'Error fetching anonymous report count' }, { status: 500 });
  }
}
