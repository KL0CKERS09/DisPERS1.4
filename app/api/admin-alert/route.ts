import { connectToDB } from "@/libs/mongodb";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

// Helper to validate base64 image
const isBase64Image = (str) => {
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    return base64Regex.test(str);
};

export async function POST(req) {
    try {
        const data = await req.json();
        await connectToDB();

        const alerts = Array.isArray(data) ? data : [data];

        const validAlerts = alerts
            .filter(alert => {
                if (!alert.img || !isBase64Image(alert.img)) {
                    console.warn(`Skipping invalid image for alert titled: "${alert.title}"`);
                    return false;
                }
                return true;
            })
            .map(({ title, description, severity, location, status, img }) => ({
                title,
                description,
                severity,
                location,
                status,
                img,
            }));

        if (validAlerts.length === 0) {
            return new Response("No valid alerts to insert", { status: 400 });
        }

        const inserted = await Alert.insertMany(validAlerts, { ordered: false });

        return NextResponse.json(
            { message: `${inserted.length} alerts inserted successfully.` },
            { status: 201 }
        );
    } catch (error) {
        console.error("Bulk insert error:", error);
        return new Response("Failed to insert alerts", { status: 500 });
    }
}

export async function GET(req) {
    await connectToDB();
  
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
  
    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    const total = await Alert.countDocuments();
  
    return NextResponse.json({ alerts, total });
  }
  