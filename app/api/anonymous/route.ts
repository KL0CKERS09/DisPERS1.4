import { connectToDB } from '@/libs/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
interface Report {
  image: string;
  _id: ObjectId;
  title: string;
  description: string;
  type: string;
  location: string;
  email: string;
  status: string;
  verified: boolean;
  createdAt: Date;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDB();

    const reports = Array.isArray(body) ? body : [body];

    const formattedReports = reports.map((r) => ({
      title: r.title,
      description: r.description,
      type: r.type,
      location: r.location,
      email: r.email,
      status: r.status || 'Pending',
      image: r.image || '',
      verified: false,
      createdAt: new Date(),
    }));

    const { db } = await connectToDB();
    await db.collection('anonymousReport').insertMany(formattedReports);

    return NextResponse.json(
      { message: `${formattedReports.length} report(s) created successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk insert error:", error);
    return NextResponse.json(
      { message: "Failed to process reports" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const { db } = await connectToDB();
    const reports: Report[] = await db.collection("anonymousReport").find().sort({ createdAt: -1 }).toArray();

    const formatted = reports.map((r) => ({
      id: r._id.toString(),
      title: r.title,
      description: r.description,
      type: r.type,
      location: r.location,
      email: r.email,
      status: r.status,
      verified: r.verified,
      imageUrl: r.image || "",
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ reports: formatted });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch reports" }, { status: 500 });
  }
}
