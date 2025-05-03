import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI_ALERT!;
const client = new MongoClient(uri);
const dbName = 'safeNetDb';
const collectionName = 'reports'; // update if different

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const pipeline = [
      {
        $group: {
          _id: '$category', // make sure this field exists
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];

    const categoryCounts = await collection.aggregate(pipeline).toArray();
    const total = categoryCounts.reduce((sum, item) => sum + item.count, 0);

    const result = categoryCounts.map((item) => ({
      category: item._id || 'Unknown',
      count: item.count,
      percentage: ((item.count / total) * 100).toFixed(1), // rounded to 1 decimal
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error fetching category distribution:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
