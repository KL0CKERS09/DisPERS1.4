import mongoose, { Schema, Connection, Model, Document } from "mongoose";

interface EvacuationDoc extends Document {
  name: string;
  type: string;
  address: string;
  capacity: number;
  status: string;
  contact: string;
}

const EvacuationSchema = new Schema<EvacuationDoc>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, required: true },
    contact: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "evacuations",
  }
);

export function getEvacuationModel(conn: Connection): Model<EvacuationDoc> {
  return conn.models.Evacuation || conn.model<EvacuationDoc>("Evacuation", EvacuationSchema);
}
