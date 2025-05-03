import { cookies } from 'next/headers';
import { connectToDB } from '@/libs/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized - No token found' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();
    const { title, description, category, area, location,severity, status, verified, image } = await req.json();

    if (image && !image.startsWith('data:image/')) {
      return NextResponse.json({ message: 'Invalid image format' }, { status: 400 });
    }

    const report = {
      userId: new ObjectId(decoded.userId),
      title,
      description,
      category,
      area,
      location,
      severity,
      verified,
      status,
      image,
      createdAt: new Date(),
    };

    const result = await db.collection('reports').insertOne(report);

    return result.insertedId
      ? NextResponse.json({ message: 'Report submitted successfully!' }, { status: 201 })
      : NextResponse.json({ message: 'Failed to submit report' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token or error in submission' }, { status: 403 });
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized - No token found' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();

    const reports = await db
      .collection('reports')
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedReports = reports.map((report) => ({
      id: report._id.toString(),
      title: report.title,
      description: report.description,
      type: report.category,
      location: report.location,
      verified: report.verified,
      status: report.status,
      date: report.createdAt,
      image: report.image || '',
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching reports' }, { status: 500 });
  }
}
