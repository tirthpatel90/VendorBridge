import mongoose, { Schema, Document, Model } from "mongoose"

const LineItemSchema = new Schema({
  name: String,
  qty: Number,
  unitPrice: Number,
}, { _id: false })

export interface IPurchaseOrder extends Document {
  vendor: string
  issueDate: string
  dueDate: string
  status: "Approved" | "Pending" | "Delivered" | "Paid" | "Cancelled"
  subtotal: number
  tax: number
  total: number
  items: { name: string; qty: number; unitPrice: number }[]
  createdAt: Date
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    vendor: { type: String, required: true },
    issueDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ["Approved", "Pending", "Delivered", "Paid", "Cancelled"], default: "Pending" },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    items: [LineItemSchema],
  },
  { timestamps: true }
)

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.PurchaseOrder
}
const PurchaseOrder: Model<IPurchaseOrder> = mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema)
export default PurchaseOrder
