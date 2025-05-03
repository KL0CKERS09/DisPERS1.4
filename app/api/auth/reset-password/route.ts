import { connectToDB } from "@/libs/mongodb"; // MongoDB connection helper
import User from "@/models/login"; // User model
import bcrypt from "bcryptjs"; // Used to hash the new password
import ResetToken from "@/models/resetToken"; // Reset token model

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    // Step 1: Connect to MongoDB
    await connectToDB();

    // Step 2: Check if the reset token exists for the email and code
    const token = await ResetToken.findOne({ email, code });
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired code" }),
        { status: 400 }
      );
    }

    // Step 3: Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 4: Update the user's password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Step 5: Delete the reset token after the password is updated
    await ResetToken.deleteOne({ email });

    return new Response(
      JSON.stringify({ message: "Password reset successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ message: "Error resetting password" }),
      { status: 500 }
    );
  }
}