import connectAnnDB from "@/libs/anndb";
import { getAnnouncementModel } from "@/models/announcement"; // this should already handle the collection name
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const conn = await connectAnnDB();
        const Ann = getAnnouncementModel(conn);

        const announcements = Array.isArray(body) ? body : [body];

        for (const ann of announcements) {
            const { title, description, location, type, img } = ann;
            if (!title || !description || !location || !type || !img) {
                return NextResponse.json(
                    { message: "All fields are required in each announcement." },
                    { status: 400 }
                );
            }
        }

        const createdAnnouncements = await Ann.insertMany(announcements);

        return NextResponse.json(
            {
                message: "Announcements created successfully",
                announcements: createdAnnouncements,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /announcement error:", error);
        return NextResponse.json(
            { message: "Failed to create announcements" },
            { status: 500 }
        );
    }
}
export async function GET() {
    try {
        const conn = await connectAnnDB();
        const Ann = getAnnouncementModel(conn);

        const announcements = await Ann.find();

        return NextResponse.json({ announcements });
    } catch (error) {
        console.error("❌ GET /announcement error:", error);
        return NextResponse.json(
            { message: "Failed to fetch announcements" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // Get the announcement ID from the URL path (e.g., /api/announcement/:id)
        const { pathname } = req.nextUrl;
        const id = pathname.split("/").pop(); // Extracts the ID from the URL

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