import { NextResponse } from 'next/server';
import { connectToDB } from '@/libs/mongodb';

export async function GET() {
  try {
    const db = await connectToDB();

    const reportsWithUsers = await db.collection('reports').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          title: 1,
          category: 1,
          severity: 1,
          location: 1,
          createdAt: 1,
          user: {
            username: '$userInfo.username',
            profilePicture: '$userInfo.profilePicture',
            firstName: '$userInfo.firstName',
            lastName: '$userInfo.lastName',
            email: '$userInfo.email',
          },
        },
      },
    ]).toArray();

    const formatted = reportsWithUsers.map((r) => ({
      id: r._id.toString(),
      status: r.status,
      title: r.title,
      category: r.category,
      severity: r.severity,
      location: r.location,
      createdAt: r.createdAt,
      user: r.user
        ? {
            username: r.user.username || 'Unknown',
            profilePicture: r.user.profilePicture || null,
            fullName: `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim(),
            email: r.user.email || '',
          }
        : null,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Failed to fetch reports with user data:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
