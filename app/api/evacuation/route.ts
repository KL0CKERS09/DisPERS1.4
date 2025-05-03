// app/api/evacuations/route.ts

import { connectToDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { getEvacuationModel } from "@/models/evacuation";

export async function GET() {
  try {
    const conn = await connectToDB();
    const Evacuation = getEvacuationModel(conn);

    const evacuations = await Evacuation.find();

    return NextResponse.json({ evacuations });
  } catch (error) {
    console.error("❌ GET /evacuations error:", error);
    return NextResponse.json(
      { message: "Failed to fetch evacuations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const conn = await connectToDB();
      const Evacuation = getEvacuationModel(conn);
  
      const body = await request.json();
  
      // Validate input
      if (!body || (Array.isArray(body) && body.length === 0) || (!Array.isArray(body) && Object.keys(body).length === 0)) {
        return NextResponse.json(
          { message: "No valid data provided" },
          { status: 400 }
        );
      }
  
      // Ensure adminId is provided
      const evacuationsToInsert = Array.isArray(body) ? body : [body];
      evacuationsToInsert.forEach(evacuation => {
        if (!evacuation.adminId) {
          throw new Error("adminId is required for each evacuation.");
        }
      });
  
      // Insert evacuations
      const insertedEvacuations = await Evacuation.insertMany(evacuationsToInsert);
  
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
  