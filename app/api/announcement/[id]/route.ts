import connectAnnDB from "@/libs/anndb";
import { getAnnouncementModel } from "@/models/announcement"; // this should already handle the collection name
import { NextRequest, NextResponse } from "next/server";

// DELETE Method
export async function DELETE(req: NextRequest) {
    try {
        const { pathname } = req.nextUrl;
        const id = pathname.split("/").pop(); // Extract the ID from the URL

        if (!id) {
            return NextResponse.json(
                { message: "Announcement ID is required." },
                { status: 400 }
            );
        }

        const conn = await connectAnnDB();
        const Ann = getAnnouncementModel(conn);

        const deletedAnnouncement = await Ann.findByIdAndDelete(id);

        if (!deletedAnnouncement) {
            return NextResponse.json(
                { message: "Announcement not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Announcement deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ DELETE /announcement error:", error);
        return NextResponse.json(
            { message: "Failed to delete announcement" },
            { status: 500 }
        );
    }
}

// PUT Method (Update Announcement)
export async function PUT(req: NextRequest) {
    try {
        const { pathname } = req.nextUrl;
        const id = pathname.split("/").pop(); // Extract the ID from the URL

        if (!id) {
            return NextResponse.json(
                { message: "Announcement ID is required." },
                { status: 400 }
            );
        }

        const body = await req.json(); // Get the request body
        const { title, description, location, type, img } = body;

        // Validate request body
        if (!title || !description || !location || !type || !img) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        const conn = await connectAnnDB();
        const Ann = getAnnouncementModel(conn);

        // Find and update the announcement
        const updatedAnnouncement = await Ann.findByIdAndUpdate(
            id,
            { title, description, location, type, img },
            { new: true } // Return the updated document
        );

        if (!updatedAnnouncement) {
            return NextResponse.json(
                { message: "Announcement not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Announcement updated successfully.", updatedAnnouncement },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ PUT /announcement error:", error);
        return NextResponse.json(
            { message: "Failed to update announcement" },
            { status: 500 }
        );
    }
}
