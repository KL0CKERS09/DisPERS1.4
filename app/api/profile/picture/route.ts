import { cookies } from 'next/headers';
import { connectToDB } from '@/libs/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const token = cookies().get('authToken')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();
    const { profilePicture } = await req.json();

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { profilePicture } }
    );

    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: 'Error uploading picture' }, { status: 500 });
  }
}
