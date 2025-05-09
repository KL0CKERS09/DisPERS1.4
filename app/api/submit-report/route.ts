import { NextResponse } from "next/server";
import { connectToDB } from "@/libs/mongodb"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDB();

    const report = {
      title: body.title,
      description: body.description,
      category: body.category,
      area: body.area,
      location: body.location,
      verified: body.verified || "Verified",
      status: body.status || "Active",
      severity: body.severity,
      image: body.image || "",
      createdAt: new Date(),
    };

    const { db } = await connectToDB();
    await db.collection("reports").insertOne(report);

    return NextResponse.json(
      { message: "Report created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Report insert error:", error);
    return NextResponse.json(
      { message: "Failed to submit report" },
      { status: 500 }
    );
  }
}
