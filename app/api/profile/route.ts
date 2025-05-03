import { cookies } from 'next/headers';
import { connectToDB } from '@/libs/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();

    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password, ...userProfile } = user; 
    return NextResponse.json(userProfile);
  } catch (error: any) {
    return NextResponse.json({ message: 'Invalid token', error: error.message }, { status: 403 });
  }
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();
    const { firstName, lastName, age, phone, email, username } = await req.json();

    const updateFields = { firstName, lastName, age, phone, email, username };

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateFields }
    );

    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    const { password, ...userProfile } = updatedUser || {};
    return NextResponse.json(userProfile);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
  }
}
