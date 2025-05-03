import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/registrationdb"; 
import User from "@/models/registration"; 
import bcrypt from "bcryptjs"; 

export async function POST(req: NextRequest) {
    try {
        const {
            firstName,
            lastName,
            age,
            phone,
            address,
            email,
            username,
            password,
            role,
        } = await req.json();

        await connectMongoDB();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            age,
            phone,
            address,
            email,
            username,
            password: hashedPassword,
            role,
        });

        return NextResponse.json(
            { message: "User registered successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Failed to register user", error },
            { status: 500 }
        );
    }
}
