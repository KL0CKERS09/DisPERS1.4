import { connectToDB } from '@/libs/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

interface Report {
  _id: ObjectId;
  title: string;
  description: string;
  type: string;
  location: string;
  email: string;
  status: string;
  imageUrl: string;
  verified: boolean;
  createdAt: Date;
}

export async function POST(req: Request) {
  try {
    const { db } = await connectToDB();
    const body = await req.formData();

    const title = body.get("title") as string;
    const description = body.get("description") as string;
    const type = body.get("type") as string;
    const location = body.get("location") as string;
    const email = body.get("email") as string;
    const status = body.get("status") as string;
    const imageFile = body.get("image") as File | null;

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fs = await import("fs/promises");
      const path = await import("path");
      const { v4: uuidv4 } = await import("uuid");

      const filename = `${uuidv4()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const report: Report = {
      _id: new ObjectId(),
      title,
      description,
      type,
      location,
      email,
      status,
      imageUrl,
      verified: false,
      createdAt: new Date(),
    };

    const result = await db.collection("anonymousReport").insertOne(report);

    return result.insertedId
      ? NextResponse.json({ message: "Report submitted successfully!" }, { status: 201 })
      : NextResponse.json({ message: "Failed to submit report" }, { status: 400 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server error while submitting report" }, { status: 500 });
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
      imageUrl: r.imageUrl || "",
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ reports: formatted });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch reports" }, { status: 500 });
  }
}