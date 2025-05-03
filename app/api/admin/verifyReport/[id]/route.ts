import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/libs/mongodb";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Destructuring params

  // Validate the ID format
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    // Connect to DB
    const db = await connectToDB();

    // Perform the update
    const result = await db.db.collection("reports").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Resolved" } }
    );

    // If no matching report found
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Successfully updated
    return NextResponse.json({ message: "Report verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
