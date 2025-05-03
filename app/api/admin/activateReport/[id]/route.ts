import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/libs/mongodb"; // Assuming this path is correct

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Destructure the ID from params

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const db = await connectToDB();

    const result = await db.db.collection("reports").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Active" } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report activated successfully" });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
