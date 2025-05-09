// app/api/evacuations/route.ts

import { connectToDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { getEvacuationModel } from "@/models/evacuation";

export async function GET() {
  try {
    const conn = await connectToDB();
    const Evacuation = getEvacuationModel(conn);

    const evacuations = await Evacuation.find().lean(); 

    return NextResponse.json(evacuations, { status: 200 });
  } catch (error) {
    console.error("❌ GET /evacuations error:", error);
    return NextResponse.json(
      { message: "Failed to fetch evacuations" },
      { status: 500 }
    );
  }
}

// app/api/evacuations/route.ts

export async function POST(request: Request) {
  try {
    const conn = await connectToDB();
    const Evacuation = getEvacuationModel(conn);

    const body = await request.json();

    if (!body || (Array.isArray(body) && body.length === 0) || (!Array.isArray(body) && Object.keys(body).length === 0)) {
      return NextResponse.json(
        { message: "No valid data provided" },
        { status: 400 }
      );
    }

    const evacuationsToInsert = Array.isArray(body) ? body : [body];

    await Evacuation.insertMany(evacuationsToInsert);

    return NextResponse.json(
      { message: "Evacuations added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /evacuations error:", error);
    return NextResponse.json(
      { message: "Failed to add evacuations" },
      { status: 500 }
    );
  }
}
