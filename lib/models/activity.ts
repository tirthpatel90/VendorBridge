import mongoose, { Schema, Document, Model } from "mongoose"

export interface IActivity extends Document {
  type: "RFQs" | "Approvals" | "Invoices" | "Vendors" | "Quotations"
  tone: "success" | "warning" | "info" | "danger" | "neutral"
  user: string
  initials: string
  description: string
  createdAt: Date
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: { type: String, enum: ["RFQs", "Approvals", "Invoices", "Vendors", "Quotations"], required: true },
    tone: { type: String, enum: ["success", "warning", "info", "danger", "neutral"], required: true },
    user: { type: String, required: true },
    initials: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Activity
}
const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema)
export default Activity
