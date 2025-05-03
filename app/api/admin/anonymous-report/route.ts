import { connectToDB } from '@/libs/mongodb';
import { NextResponse } from 'next/server';

interface AnonymousReport {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  title: string;
  description: string;
  type: string;
  location: string;
  email: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}

export async function GET() {
  try {
    const { db } = await connectToDB();
    const reports = await db
      .collection('anonymousReport')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const formattedReports = reports.map((report: AnonymousReport) => ({
      _id: report._id.toString(),
      title: report.title,
      description: report.description,
      type: report.type,
      location: report.location,
      email: report.email,
      image: report.image || '',
      createdAt: report.createdAt?.toISOString() || '',
      updatedAt: report.updatedAt?.toISOString() || '',
      status: report.status || 'Pending',
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error('Error fetching anonymous reports:', error);
    return NextResponse.json({ message: 'Error fetching anonymous reports' }, { status: 500 });
  }
}