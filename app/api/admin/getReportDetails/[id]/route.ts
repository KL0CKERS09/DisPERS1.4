import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/libs/mongodb";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const db = await connectToDB();
    const reportsCollection = db.db.collection("reports");
    const usersCollection = db.db.collection("users");

    const report = await reportsCollection.findOne({ _id: new ObjectId(id) });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(report.userId) });

    const responseData = {
      ...report,
      user: user
        ? {
            username: user.username,
            profilePicture: user.profilePicture || null, // Add this field if you store profile pictures
          }
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching report details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
