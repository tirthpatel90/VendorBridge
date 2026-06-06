import mongoose, { Schema, Document, Model } from "mongoose"

export interface IInvoice extends Document {
  poId: string
  vendor: string
  issueDate: string
  dueDate: string
  status: "Paid" | "Pending Payment" | "Overdue"
  amount: number
  createdAt: Date
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    poId: { type: String, required: true },
    vendor: { type: String, required: true },
    issueDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ["Paid", "Pending Payment", "Overdue"], default: "Pending Payment" },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Invoice
}
const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema)
export default Invoice
