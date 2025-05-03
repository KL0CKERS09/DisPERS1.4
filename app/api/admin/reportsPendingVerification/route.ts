// app/api/admin/reportsPendingVerification/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';

export async function GET() {
  try {
    const db = await connectToDB();
    const reports = await db.collection('reports')
      .find({}) // Fetch ALL reports regardless of status
      .toArray();

    const formatted = reports.map((r) => ({
      id: r._id.toString(),
      status: r.status,
      title: r.title,
      category: r.category,
      severity: r.severity,
      location: r.location,
      date: r.date,
      reporter: r.reporter,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Failed to fetch reports:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
