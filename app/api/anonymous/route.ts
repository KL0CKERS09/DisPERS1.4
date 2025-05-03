import { connectToDB } from '@/libs/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import AnonymousReport from "@/models/anonymousRep";
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

    const {
      title,
      description,
      type,
      location,
      email,
      image,
      status,
    } = body;
    
    const report = new AnonymousReport({
      title,
      description,
      type,
      location,
      email,
      status,
      image,
    });

    await connectToDB();
    await report.save();

    return NextResponse.json({ message: "Report created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving anonymous report:", error);
    return NextResponse.json(
      { message: "Failed to create anonymous report" },
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
