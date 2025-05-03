
import { Connection, Schema } from "mongoose";

const evacuationSchema = new Schema(
  {
    adminId: { type: String, required: true },
    evacuationName: { type: String, required: true },
    evacuationType: { type: String, required: true },
    evacuationAddress: { type: String, required: true },
    evacuationCapacity: { type: Number, required: true },
    evacuationStatus: { type: String, required: true },
    evacuationContact: { type: String, required: true },
  },
  { timestamps: true }
);

export const getEvacuationModel = (conn: Connection) => {
  return (
    conn.models?.Evacuation ||
    conn.model("Evacuation", evacuationSchema, "evacuations")
  );
};

export default getEvacuationModel;
