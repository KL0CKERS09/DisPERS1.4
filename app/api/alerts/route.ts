import { connectToDB } from "@/libs/mongodb";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

// Helper function to check if the string is a valid base64 image
const isBase64Image = (str) => {
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    return base64Regex.test(str);
};

export async function POST(req) {
    try {
        const { title, description, severity, location, status, img } = await req.json();

        if (!img || !isBase64Image(img)) {
            return new Response('Valid base64 image string is required', { status: 400 });
        }

        await connectToDB();

        const newAlert = new Alert({
            title,
            description,
            severity,
            location,
            status,
            img, // Ensure img is valid base64
        });

        await newAlert.save();

        return new Response(JSON.stringify({ alert: newAlert }), { status: 201 });
    } catch (error) {
        console.error('Error creating alert:', error);
        return new Response('Failed to create alert', { status: 500 });
    }
}

export async function GET() {
    await connectToDB(); 
    const alerts = await Alert.find();
    return NextResponse.json({ alerts });
}
