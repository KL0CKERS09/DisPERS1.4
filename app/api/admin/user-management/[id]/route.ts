// app/api/registrations/[id]/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDB } from '@/libs/mongodb';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = params;

  try {
    const { status } = await req.json();

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const client = await connectToDB();
    const db = client.db('safeNetDb');
    const result = await db.collection('registrations').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Entry not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json({ message: 'Failed to update status' }, { status: 500 });
  }
}
