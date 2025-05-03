// app/api/admin/area-growth/route.ts

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI_ALERT!;
const client = new MongoClient(uri);
const dbName = 'safeNetDb'; 
const collectionName = 'reports';

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const pipeline = [
      {
        $group: {
          _id: '$area', // field that represents the report location
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    const formatted = results.map(item => ({
      area: item._id || 'Unknown',
      reports: item.count,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error fetching area report growth data:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
