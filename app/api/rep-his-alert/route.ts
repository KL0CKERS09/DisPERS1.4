import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set in env');
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    const userId = decoded.userId;

    const { db } = await connectToDB();
    const reports = await db
      .collection('reports')
      .find({ userId }) // userId is a string here, matching how it's stored
      .toArray();

    return NextResponse.json({ reports }, { status: 200 });

  } catch (error) {
    console.error('Error fetching report history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
