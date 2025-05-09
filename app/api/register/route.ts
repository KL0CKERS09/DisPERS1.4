import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/registrationdb";
import User from "@/models/registration";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectMongoDB();

    const users = Array.isArray(data) ? data : [data];

    // Check for existing email or username
    for (const user of users) {
      const existingEmail = await User.findOne({ email: user.email });
      const existingUsername = await User.findOne({ username: user.username });

      const errors: { email?: string; username?: string } = {};
      if (existingEmail) errors.email = "Email already in use.";
      if (existingUsername) errors.username = "Username already taken.";

      if (Object.keys(errors).length > 0) {
        return NextResponse.json(errors, { status: 400 });
      }
    }

    // If all good, hash passwords and insert
    const usersToInsert = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(usersToInsert);

    return NextResponse.json(
      { message: "Users registered successfully", users: createdUsers },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk registration error:", error);
    return NextResponse.json(
      { message: "Failed to register users", error },
      { status: 500 }
    );
  }
}
