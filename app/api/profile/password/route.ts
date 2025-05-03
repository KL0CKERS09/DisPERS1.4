import { cookies } from 'next/headers';
import { connectToDB } from '@/libs/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// POST – Verify current password
export async function POST(req: Request) {
  const token = (await cookies()).get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ isValid: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { db } = await connectToDB();

    const { currentPassword } = await req.json();

    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

    if (!user || !user.password) {
      return NextResponse.json({ isValid: false, message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    return NextResponse.json({ isValid: isMatch });
  } catch (error: any) {
    console.error('Error verifying current password:', error);
    return NextResponse.json({ isValid: false, message: 'Error verifying password' }, { status: 500 });
  }
}

// PUT – Update password
export async function PUT(req: Request) {
  const token = (await cookies()).get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Connect to DB
    const { db } = await connectToDB();

    // Extract currentPassword and newPassword from request body
    const { currentPassword, newPassword } = await req.json();

    // Fetch user from DB
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    // Validate the new password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json({
        message: 'New password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
      }, { status: 400 });
    }

    // Ensure the new password is not the same as the current password
    if (currentPassword === newPassword) {
      return NextResponse.json({ message: 'New password cannot be the same as the current password.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the password in the database
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ message: 'Password changed successfully!' });
  } catch (error: any) {
    console.error('Error changing password:', error); // Log for debugging
    return NextResponse.json({ message: 'Error changing password', error: error.message }, { status: 500 });
  }
}
