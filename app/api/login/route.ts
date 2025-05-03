import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import validator from 'validator'; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate inputs
    if (!email || !validator.isEmail(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 });
    }
    if (!password || password.length < 6) { 
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const db = await connectToDB(); 
    const user = await db.collection('users').findOne({ email });


    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in the environment variables');
      return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    response.headers.append(
      'Set-Cookie',
      serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
