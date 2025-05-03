// app/api/user-management/route.ts

import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const { db } = await connectToDB();
    const collection = db.collection('users');
    const entries = await collection.find({}).toArray();
    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to fetch entries', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, type, contact, status } = body;

    if (!id || !name || !type || !contact || !status) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const { db } = await connectToDB();
    const collection = db.collection('registrations');
    const result = await collection.insertOne({ id, name, type, contact, status });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to insert', { status: 500 });
  }
}
