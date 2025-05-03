import { connectToDB } from "@/libs/mongodb";
import User from "@/models/login";
import ResetToken from "@/models/resetToken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, username, phone } = await req.json();

    await connectToDB();

    const user = await User.findOne({ email, username, phone });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found with the provided credentials" }), {
        status: 404,
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await ResetToken.findOneAndUpdate(
      { email },
      { code, createdAt: new Date() },
      { upsert: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your reset code is: ${code}`,
    });

    return new Response(JSON.stringify({ message: "Code sent to email" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Error sending email" }), {
      status: 500,
    });
  }
}
