import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRfq extends Document {
  title: string
  category: string
  status: "Open" | "Closed" | "Draft" | "Awarded"
  deadline: string
  quotations: number
  createdBy: string
  createdAt: Date
}

const RfqSchema = new Schema<IRfq>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    status: { type: String, enum: ["Open", "Closed", "Draft", "Awarded"], default: "Open" },
    deadline: { type: String, required: true },
    quotations: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Rfq
}
const Rfq: Model<IRfq> = mongoose.models.Rfq || mongoose.model<IRfq>("Rfq", RfqSchema)
export default Rfq
