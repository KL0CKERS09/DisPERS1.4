import { Connection, Schema } from "mongoose";

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

export const getAnnouncementModel = (conn: Connection) => {
  return (
    conn.models?.Announcement ||
    conn.model("Announcement", announcementSchema, "announcements")
  );
};

export default getAnnouncementModel;
