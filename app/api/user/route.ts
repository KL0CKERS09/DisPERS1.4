import { cookies } from 'next/headers';
import { connectToDB } from '@/libs/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      {
        projection: {
          _id: 1,
          email: 1,
          username: 1,
          profilePicture: 1, // base64 string with data URI prefix
        },
      }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid Token' }, { status: 403 });
  }
}
