import mongoose, { Schema, Document, Model } from "mongoose"

export interface IQuotation extends Document {
  rfqId: string
  vendor: string
  rating: number
  delivery: string
  unitPrices: number[]
  total: number
  createdAt: Date
}

const QuotationSchema = new Schema<IQuotation>(
  {
    rfqId: { type: String, default: "RFQ-2025-088" },
    vendor: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    delivery: { type: String, default: "TBD" },
    unitPrices: [{ type: Number }],
    total: { type: Number, required: true },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Quotation
}
const Quotation: Model<IQuotation> = mongoose.models.Quotation || mongoose.model<IQuotation>("Quotation", QuotationSchema)
export default Quotation
