import { NextRequest } from 'next/server';
import { connectToDB } from '@/libs/mongodb';
import { getEvacuationModel } from '@/models/evacuation';
import mongoose from 'mongoose';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const conn = await connectToDB();
    const Evacuation = getEvacuationModel(conn);
  
    try {
      if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
      }
  
      const deleted = await Evacuation.findByIdAndDelete(params.id);
  
      if (!deleted) {
        return new Response(JSON.stringify({ error: 'Evacuation not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: 'Deleted successfully' }), { status: 200 });
    } catch (err) {
      console.error('Delete error:', err);
      return new Response(JSON.stringify({ error: 'Delete failed', details: err }), { status: 500 });
    }
  }

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const conn = await connectToDB();
  const Evacuation = getEvacuationModel(conn);

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
    }

    const body = await req.json();

    const updated = await Evacuation.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Evacuation not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error('Update error:', err);
    return new Response(JSON.stringify({ error: 'Update failed', details: err }), { status: 500 });
  }
}