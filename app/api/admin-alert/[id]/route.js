import { connectToDB } from "@/libs/mongodb";
import Alert from "@/models/alert";
import { NextResponse } from "next/server";

// Fetch an alert by ID
export async function GET(req, { params }) {
    const { id } = params;
    await connectToDB();
    const alert = await Alert.findById(id);
    if (!alert) {
        return NextResponse.json({ message: "Alert not found" }, { status: 404 });
    }
    return NextResponse.json(alert);
}

// Update the status and image of an alert
export async function PATCH(req, { params }) {
    const { id } = params;
    const { status, img } = await req.json();

    console.log(`Updating alert ${id} with status: ${status}, image provided: ${!!img}`);

    await connectToDB();

    const updated = await Alert.findByIdAndUpdate(
        id,
        {
            status, // <--- use the value as-is
            img: img || undefined,
        },
        { new: true }
    );

    if (!updated) {
        return NextResponse.json({ message: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Alert updated successfully", updated });
}

// Delete an alert
export async function DELETE(req, { params }) {
    // Ensure params are awaited
    const { id } = await params;

    await connectToDB();
    const deleted = await Alert.findByIdAndDelete(id);

    if (!deleted) {
        return new Response('Alert not found', { status: 404 });
    }

    return new Response('Alert deleted successfully', { status: 200 });
}